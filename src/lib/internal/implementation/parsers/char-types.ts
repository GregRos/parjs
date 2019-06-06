
import {compose} from "../combinators/combinator";
import {CharInfo} from "char-info";
import {many} from "../combinators/many";
import {str} from "../combinators/str";
import {stringLen} from "./string-len";
import {charWhere} from "./char-where";



export function anyChar() {
    return stringLen(1);
}

export function space() {
    return charWhere(CharInfo.isSpace);
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
    return charWhere(CharInfo.isLetter);
}

export function uniLetter() {
    return charWhere(CharInfo.isUniLetter);
}

export function digit() {
    return charWhere(CharInfo.isDecimal);
}

export function uniDigit() {
    return charWhere(CharInfo.isUniDecimal);
}

export function hex() {
    return charWhere(CharInfo.isHex);
}

export function lower() {
    return charWhere(CharInfo.isLower);
}

export function upper() {
    return charWhere(CharInfo.isUpper);
}

export function uniLower() {
    return charWhere(CharInfo.isUniLower);
}

export function whitespace() {
    return charWhere(char => CharInfo.isSpace(char) || CharInfo.isNewline(char)).pipe(
        many(),
        str()
    );
}
