import { manySepBy, map, then, thenq } from "parjs/combinators";
import { seq } from "stdseq";
import {
    pAnyFieldText,
    pCodepoint,
    pCodepointName,
    pFieldSeparator,
    pUcdRowParser,
    pUntilLineBreak
} from "./common.js";
/*
  Example Input:
    001F;<control>;Cc;0;S;;;;;N;INFORMATION SEPARATOR ONE;;;;
    0020;SPACE;Zs;0;WS;;;;;N;;;;;
    0021;EXCLAMATION MARK;Po;0;ON;;;;;N;;;;;
    0022;QUOTATION MARK;Po;0;ON;;;;;N;;;;;
 */
const pUnicodeDataRow = pCodepoint // 0: codepoint
    .pipe(
        thenq(pFieldSeparator),
        then(pCodepointName), // 1: name
        thenq(pFieldSeparator),
        then(pAnyFieldText), // 2: general category
        thenq(pFieldSeparator),
        thenq(pAnyFieldText.pipe(manySepBy(pFieldSeparator, 7))) // ignore 7 fields
    )
    .pipe(
        thenq(pFieldSeparator),
        then(pCodepointName), // 3: old name
        thenq(pUntilLineBreak)
    )
    .expects("UnicodeData row");

export const pUnicodeData = (includeName: boolean) =>
    pUcdRowParser(pUnicodeDataRow, ([[[codepoint, name], category], oldName]) => {
        let inclName = includeName || name.includes(", ");
        return {
            codepoint,
            name: inclName ? name : undefined,
            category,
            oldName: inclName ? oldName : undefined
        };
    }).pipe(
        map(function* (rows) {
            let stateRangeStart: (typeof rows)[0] | null = null;
            for (const codepoint of rows) {
                if (codepoint.name?.includes("Private Use")) {
                    continue;
                }
                if (codepoint.name?.includes(", First")) {
                    // This is a range, we need to generate the characters ourselves
                    stateRangeStart = codepoint;
                    continue;
                }
                if (codepoint.name?.includes(", Last")) {
                    if (!stateRangeStart) {
                        throw new Error("Invalid state, expected range start");
                    }
                    // Get rid of start, end < >
                    let group = stateRangeStart.name!.slice(1, -1);
                    // Get rid of the ", Last" part
                    group = group.split(", ")[0];
                    group = group.toUpperCase();
                    // IMPORTANT: A single string is used for all codepoints in the range
                    // so we don't fill memory with useless generated strings
                    const template = `${group}-%CODEPOINT`;

                    for (const cp of seq.range(stateRangeStart.codepoint, codepoint.codepoint)) {
                        yield {
                            codepoint: cp,
                            name: includeName ? template : undefined,
                            category: stateRangeStart.category
                        };
                    }
                    stateRangeStart = null;
                    yield {
                        codepoint: codepoint.codepoint,
                        name: includeName
                            ? codepoint.name === "<control>"
                                ? codepoint.oldName
                                : codepoint.name
                            : undefined,
                        category: codepoint.category
                    };
                    continue;
                }
                yield {
                    codepoint: codepoint.codepoint,
                    name: includeName
                        ? codepoint.name === "<control>"
                            ? codepoint.oldName
                            : codepoint.name
                        : undefined,
                    category: codepoint.category
                };
            }
        })
    );
