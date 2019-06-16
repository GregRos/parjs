import {many} from "../combinators/many";
import {stringify} from "../combinators/stringify";
import {stringLen} from "./string-len";
import {charWhere} from "./char-where";

import {
    isLetter,
    isDigit,
    uniIsDecimal,
    uniIsLetter,
    uniIsLower,
    isHex,
    isUpper,
    isLower,
    isSpace, isNewline
} from "char-info";
import {must} from "../combinators/must";

/**
 * Returns a parser that parses any single character. Equivalent
 * to `stringLen(1)`.
 */
export function anyChar() {
    return stringLen(1);
}

/**
 * Returns a parser that parses a single ASCII inline space.
 */
export function space() {
    return charWhere(isSpace);
}

/**
 * Returns a parser that parses at least one ASCII inline space.
 */
export function spaces1() {
    return space().pipe(
        many(),
        must(x => x.length > 0, {
            kind: "Soft"
        }),
        stringify()
    );
}

/**
 * Returns a parser that parses any character in the string `options`.
 * @param options A string of alternative characters.
 */
export function anyCharOf(options: string) {
    return charWhere(c => options.includes(c), {
        reason: `any char of ${options}`
    });
}

/**
 * Returns a parser that parses any character not in the string `exclusions`.
 * @param exclusions A string of characters to exclude.
 */
export function noCharOf(exclusions: string) {
    return charWhere(c => !exclusions.includes(c), {
        reason: `no char of: ${exclusions}`
    });
}

/**
 * Returns a parser that parses a single ASCII letter.
 */
export function letter() {
    return charWhere(isLetter);
}

/**
 * Returns a parser that parses a single Unicode letter.
 */
export function uniLetter() {
    return charWhere(uniIsLetter.char);
}

/**
 * Returns a parser that parses a single digit in base `base`.
 */
export function digit(base = 10) {
    return charWhere(x => isDigit(x, base));
}

/**
 * Returns a parser that parses a single Unicode decimal digit.
 */
export function uniDecimal() {
    return charWhere(uniIsDecimal.char);
}

/**
 * Returns a parser that parses a single hex digit.
 */
export function hex() {
    return charWhere(isHex);
}

/**
 * Returns a parser that parses a single ASCII lowercase letter.
 */
export function lower() {
    return charWhere(isLower);
}

/**
 * Returns a parser that parses a single uppercase ASCII letter.
 */
export function upper() {
    return charWhere(isUpper);
}

/**
 * Returns a parser that parses a single lowercase Unicode letter.
 */
export function uniLower() {
    return charWhere(uniIsLower.char);
}

/**
 * Returns a parser that parses any amount of ASCII whitespace characters
 * and yields the parsed text.
 */
export function whitespace() {
    return charWhere(char => isSpace(char) || isNewline(char)).pipe(
        many(),
        stringify()
    );
}
