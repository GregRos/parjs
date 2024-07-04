import { anyCharOf, hex, noCharOf, string, type Parjser } from "parjs";
import {
    between,
    many,
    manySepBy,
    map,
    mapConst,
    maybe,
    or,
    qthen,
    stringify,
    then,
    thenq
} from "parjs/combinators";
import { Range } from "./range.js";

export const spaces = anyCharOf("\t ").pipe(many(), stringify());
const pNormalChar = noCharOf(";#\n\r");
const pRangeSeparator = string("..");
export const pFieldSeparator = string(";");
export const pAnyNonLinearBreak = noCharOf("\n\r");
export const pCodepoint = hex().pipe(
    many(),
    stringify(),
    map(x => parseInt(x, 16))
);
export const pRange = pCodepoint.pipe(
    thenq(pRangeSeparator),
    then(pCodepoint),
    between(spaces),
    map(xs => new Range(...xs))
);
export const pCodepointOrRange = pCodepoint.pipe(
    then(pRangeSeparator.pipe(qthen(pCodepoint), maybe())),
    between(spaces),
    map(xs => new Range(...xs))
);
export const pCodepointName = pNormalChar.pipe(many(), stringify());
export const pUntilLineBreak = pAnyNonLinearBreak.pipe(many(), stringify());

export const pAnyFieldText = pNormalChar.pipe(
    many(),
    stringify(),
    between(spaces),
    map(x => x.trim())
);
export const pIgnoredLine = anyCharOf(" \t@#;").pipe(qthen(pUntilLineBreak), mapConst(undefined));

export function pUcdRowParser<T extends any[], R>(pDataRow: Parjser<T>, project: (x: T) => R) {
    return pIgnoredLine.pipe(
        or(pDataRow.pipe(map(project))),
        maybe(),
        manySepBy("\n"),
        map(x => x.filter(Boolean).map(x => x as Exclude<typeof x, undefined>))
    );
}
