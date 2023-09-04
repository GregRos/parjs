/**
 * @module parjs
 */
/** */

import { ResultKind } from "../result";
import { ParsingState } from "../state";
import { Parjser } from "../parjser";
import { ParjserBase } from "../parser";
import { uniIsNewline, AsciiCodes } from "char-info";

function innerNewline(unicodeRecognizer?: (x: number) => boolean): Parjser<string> {
    return new (class Newline extends ParjserBase {
        expecting = "expecting newline";
        type = "newline";
        _apply(ps: ParsingState) {
            const { position, input } = ps;
            if (position >= input.length) {
                ps.kind = ResultKind.SoftFail;
                return;
            }

            const pair = input.slice(position, position + 2);

            if (pair === "\r\n") {
                ps.position += 2;
                ps.value = pair;
                ps.kind = ResultKind.Ok;
                return;
            }
            const firstChar = pair.charCodeAt(0);
            if (
                firstChar === AsciiCodes.newline ||
                firstChar === AsciiCodes.carriageReturn ||
                (unicodeRecognizer && unicodeRecognizer(firstChar))
            ) {
                ps.position++;
                ps.value = pair[0];
                ps.kind = ResultKind.Ok;
                return;
            }
            ps.kind = ResultKind.SoftFail;
        }
    })();
}

/**
 * Parses an ASCII newline, which can be a single character or the sequence
 * `\r\n`. Yields the text that was parsed.
 */
export function newline() {
    return innerNewline();
}

/**
 * Parses a Unicode newline, which includes ASCII newline strings as well as
 * other vertical separators such as PARAGRAPH SEPARATOR.
 */
export function uniNewline() {
    return innerNewline(uniIsNewline.code);
}
