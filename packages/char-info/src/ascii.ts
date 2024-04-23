/**
 * Basic ASCII character indicators and character codes.
 * @module char-info/ascii
 * @preferred
 */

/**
 * Common ASCII character codes.
 */
export namespace AsciiCodes {
    export const a = "a".charCodeAt(0);
    export const f = "f".charCodeAt(0);
    export const F = "F".charCodeAt(0);
    export const z = "z".charCodeAt(0);
    export const A = "A".charCodeAt(0);
    export const Z = "Z".charCodeAt(0);
    export const zero = "0".charCodeAt(0);
    export const nine = "9".charCodeAt(0);
    export const newline = "\n".charCodeAt(0);
    export const maxAscii = 127;
    export const carriageReturn = "\r".charCodeAt(0);
    export const space = " ".charCodeAt(0);
    export const tab = "\t".charCodeAt(0);
    export const minus = "-".charCodeAt(0);
    export const plus = "+".charCodeAt(0);
    export const decimalPoint = ".".charCodeAt(0);
    export const e = a + 4;
    export const E = A + 4;
    export const underscore = "_".charCodeAt(0);
}

/**
 * Returns true if `code` is a hex character: `[0-9a-fA-F]`.
 * @param code The character code.
 */
export function isHexCode(code: number) {
    return code >= AsciiCodes.A && code <= AsciiCodes.F || code >= AsciiCodes.a && code <=
        AsciiCodes.f || code >= AsciiCodes.zero && code <= AsciiCodes.nine;
}

/**
 * Returns true if `code` is a digit in base `base`.
 * @param code The character code.
 * @param base The base.
 */
export function isDigitCode(code: number, base = 10) {
    let baseDif = base - 10;
    if (baseDif <= 0) {
        return code >= AsciiCodes.zero && code <= AsciiCodes.nine + baseDif;
    } else {
        return (code >= AsciiCodes.zero && code <= AsciiCodes.nine) || (code >= AsciiCodes.a && code < AsciiCodes.a + baseDif);
    }
}

/**
 * Returns true if `code` is a latin letter, `[a-zA-Z]`.
 * @param code The character code.
 */
export function isLetterCode(code: number) {
    return code >= AsciiCodes.a && code <= AsciiCodes.z || code >= AsciiCodes.A && code <=
        AsciiCodes.Z;
}

/**
 * Returns true if `code` is a latin uppercase letter, `[A-Z]`.
 * @param code The character code.
 */
export function isUpperCode(code: number) {
    return code >= AsciiCodes.A && code <= AsciiCodes.Z;
}

/**
 * Returns true if `code` is a latin lowercase letter, `[a-z]`.
 * @param code The character code.
 */
export function isLowerCode(code: number) {
    return code >= AsciiCodes.a && code <= AsciiCodes.z;
}

/**
 * Returns true if `code` is an ASCII newline character: `[\r\n]`.
 * @param code The character code.
 */
export function isNewlineCode(code: number) {
    return code === AsciiCodes.carriageReturn || code === AsciiCodes.newline;
}

/**
 * Returns true if `code` is an ASCII inline space char: `[ \t]`.
 * @param code The character code.
 */
export function isSpaceCode(code: number) {
    return code === AsciiCodes.space || code === AsciiCodes.tab;
}

/**
 * Returns true if `code` is a word character, which is a digit, a letter,
 * dash or underscore: `[0-9a-zA-Z_-]`.
 * @param code The character code.
 */
export function isWordCharCode(code: number) {
    return code >= AsciiCodes.A && code <= AsciiCodes.Z
        || code >= AsciiCodes.zero && code <= AsciiCodes.nine
        || code >= AsciiCodes.a && code <= AsciiCodes.z
        || code === AsciiCodes.underscore
        || code === AsciiCodes.minus;
}

/**
 * Returns true if `code` is an ASCII character code.
 * @param code The character code. The char code.
 */
export function isAsciiCode(code: number) {
    return code >= 0 && code <= AsciiCodes.maxAscii;
}


/**
 * Returns true if `char` begins with a hex character: `[a-fA-F0-9]`.
 * @param char A string representing a character.
 */
export function isHex(char: string) {
    return isHexCode(char.charCodeAt(0));
}

/**
 * Returns true if `char` is a digit in base `base`.
 * @param char A string representing a character.
 * @param base The base.
 */
export function isDigit(char: string, base = 10) {
    return isDigitCode(char.charCodeAt(0), base);
}


/**
 * Returns true if `char` begins with a latin letter: `[A-Za-z]`.
 * @param char A string representing a character.
 */
export function isLetter(char: string) {
    return isLetterCode(char.charCodeAt(0));
}


/**
 * Returns true if `char` begins with an uppercase latin letter: `[A-Z]`.
 * @param char A string representing a character.
 */
export function isUpper(char: string) {
    return isUpperCode(char.charCodeAt(0));
}

/**
 * Returns true if `char` begins with a lowercase latin letter: `[a-z]`.
 * @param char A string representing a character.
 */
export function isLower(char: string) {
    return isLowerCode(char.charCodeAt(0));
}

/**
 * Returns true if `char` begins with a newline: `[\r\n]`.
 * @param char A string representing a character.
 */
export function isNewline(char: string) {
    return isNewlineCode(char.charCodeAt(0));
}

/**
 * Returns true if `char` begins with an inline space: `[ \t]`.
 * @param char A string representing a character.
 */
export function isSpace(char: string) {
    return isSpaceCode(char.charCodeAt(0));
}

/**
 * Returns true if `char` begins with a word char: a letter, digit, underscore,
 * or dash: `[a-zA-Z0-9_-].
 * @param char A string representing a character.
 */
export function isWordChar(char: string) {
    return isWordCharCode(char.charCodeAt(0));
}

/**
 * Returns true if `char` begins with an ASCII character.
 * @param char A string representing a character.
 */
export function isAscii(char: string) {
    return isAsciiCode(char.charCodeAt(0));
}
