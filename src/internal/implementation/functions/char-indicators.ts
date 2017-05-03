/**
 * @module parjs/internal/implementation/functions
 */ /** */

export namespace Codes {
    export const a = 'a'.charCodeAt(0);
    export const f = 'f'.charCodeAt(0);
    export const F = 'F'.charCodeAt(0);
    export const z = 'z'.charCodeAt(0);
    export const A = 'A'.charCodeAt(0);
    export const Z = 'Z'.charCodeAt(0);
    export const zero = '0'.charCodeAt(0);
    export const nine = '9'.charCodeAt(0);
    export const newline = '\n'.charCodeAt(0);
    export const carriageReturn = '\r'.charCodeAt(0);
    export const space = 0x0020;
    export const tab = 0x0008;
    export const minus = '-'.charCodeAt(0);
    export const plus = '+'.charCodeAt(0);
    export const decimalPoint = ".".charCodeAt(0);
    export const e = a + 4;
    export const E = A + 4;
    export const enQuad = 0x2000;
    const inlineSpaces = [0x0020, 0x0009];
    const mixedUnicodeInlineSpaces = [0x0009, 0x0020, 0x00a0, 0x1680, 0x180e, 0x0009, 0x202f, 0x205f, 0x3000];
    let unicodeNewlines = [0x0085, 0x2028, 0x2029];
    export const hairSpace = 0x200a;

    export function isBetween(code : number, start : number, end : number) {
        return code >= start && code <= end;
    }

    export function isDigit(code : number, base = 10) {
        if (base <= 10) {
            return isBetween(code, zero, zero + base - 1)
        }
        if (base <= 37) {
            return isBetween(code, zero, nine) || isBetween(code, a, a + base - 11) || isBetween(code, A, A + base - 11);
        }
        return undefined;
    }

    export function digitValue(code : number) {
        if (isBetween(code, zero, nine)) {
            return code - zero;
        }
        if (isBetween(code, a, z)) {
            return 10 + code - a;
        }
        if (isBetween(code, A, Z)) {
            return 10 + code - A;
        }
        return undefined;
    }

}
