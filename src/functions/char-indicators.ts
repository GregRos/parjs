/**
 * Created by User on 24-Nov-16.
 */

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
    let unicodeNewlines = [0x000a, 0x000b, 0x000c, 0x0085, 0x2028, 0x2029];
    export const hairSpace = 0x200a;

    export function isUnicodeInlineSpace(code : number) {
        return isBetween(code, enQuad, hairSpace) || mixedUnicodeInlineSpaces.includes(code);
    }

    export function isInlineSpace(code : number) {
        return inlineSpaces.includes(code);
    }

    export function isArithmeticSign(code : number) {
        return code === minus || code == plus;
    }

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

    export function isHex(code : number) {
        return isBetween(code, zero, nine) || isBetween(code, a, f) || isBetween(code, A, F);
    }

    export function isAsciiLower(code : number) {
        return isBetween(code, a, z);
    }

    export function isAsciiUpper(code : number) {
        return isBetween(code, A, Z);
    }

    export function isAsciiLetter(code : number) {
        return isAsciiLower(code) || isAsciiUpper(code);
    }

    export function isUnicodeNewline(s : number) {
        return unicodeNewlines.includes(s);
    }
}


export namespace Chars {
    export function isUpper(s : string) {
        return s.toUpperCase() === s;
    }

    export function isLower(s : string) {
        return s.toLowerCase() === s;
    }

    export function isDigit(s : string) : boolean {
        let code = s.charCodeAt(0);
        return Codes.isDigit(code);
    }

    export function isHex(s : string) : boolean {
        let code = s.charCodeAt(0);
        return Codes.isHex(code);
    }

    export function isAsciiLower(s : string) {
        return Codes.isAsciiLower(s.charCodeAt(0))
    }

    export function isTab(s : string) {
        let code = s.charCodeAt(0);
        return code === Codes.tab;
    }

    export function isSpace(s : string) {
        let code = s.charCodeAt(0);
        return code === Codes.space;
    }
    export function isInlineSpace(s : string) {
        let code = s.charCodeAt(0);
        return Codes.isInlineSpace(code);
    }



    export function isUnicodeInlineSpace(s : string) {
        let code = s.charCodeAt(0);
        return Codes.isUnicodeInlineSpace(code);
    }

    //range: 0x2000 - 0x200a
    export function isAsciiUpper(s : string) {
        let code = s.charCodeAt(0);
       return Codes.isAsciiUpper(code);
    }



}