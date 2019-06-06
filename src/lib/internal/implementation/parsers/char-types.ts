
import {compose} from "../combinators/combinator";
import {many} from "../combinators/many";
import {str} from "../combinators/str";
import {stringLen} from "./string-len";
import {charWhere} from "./char-where";

import {
    isLetter,
    isDigit,
    uniDecimal as uniDecimalChar,
    uniLetter as uniLetterChar,
    uniLower as uniLowerChar,
    isHex,
    isUpper,
    isLower,
    isSpace, isNewline
} from "char-info";

export function anyChar() {
    return stringLen(1);
}

export function space() {
    return charWhere(isSpace);
}

export function spaces1() {
    return space().pipe(
        many(1),
        str()
    );
}

export function anyCharOf(options: string) {
    return charWhere(c => options.includes(c), `any char of ${options}`);
}

export function noCharOf(options: string) {
    return charWhere(c => !options.includes(c), `no char of: ${options}`);
}

export function letter() {
    return charWhere(isLetter);
}

export function uniLetter() {
    return charWhere(uniLetterChar.char);
}

export function digit() {
    return charWhere(x => isDigit(x));
}

export function uniDigit() {
    return charWhere(uniDecimalChar.char);
}

export function hex() {
    return charWhere(isHex);
}

export function lower() {
    return charWhere(isLower);
}

export function upper() {
    return charWhere(isUpper);
}

export function uniLower() {
    return charWhere(uniLowerChar.char);
}

export function whitespace() {
    return charWhere(char => isSpace(char) || isNewline(char)).pipe(
        many(),
        str()
    );
}
