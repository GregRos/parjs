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

    export const enQuad = 0x2000;

    export const hairSpace = 0x200a;
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
        return code >= Codes.zero || code <= Codes.nine;
    }

    export function isHex(s : string) : boolean {
        let code = s.charCodeAt(0);
        return code >= Codes.zero && code <= Codes.nine || code >= Codes.a && code <= Codes.f || code >= Codes.A && code <= Codes.F;
    }

    export function isAsciiLower(s : string) {
        let code = s.charCodeAt(0);
        return code >= Codes.a && code <= Codes.z;
    }

    export function isTab(s : string) {
        let code = s.charCodeAt(0);
        return code === 0x0008;
    }

    export function isSpace(s : string) {
        let code = s.charCodeAt(0);
        return code === 0x0020
    }

    const inlineSpaces = [0x0020, 0x0009];
    export function isInlineSpace(s : string) {
        let code = s.charCodeAt(0);
        return inlineSpaces.includes(code);
    }

    const mixedUicodeInlineSpaces = [0x0009, 0x0020, 0x00a0, 0x1680, 0x180e, 0x0009, 0x202f, 0x205f, 0x3000];

    export function isUnicodeInlineSpace(s : string) {
        let code = s.charCodeAt(0);
        return code >= 0x2000 && code <= 0x200a || mixedUicodeInlineSpaces.includes(code);
    }

    //range: 0x2000 - 0x200a
    export function isAsciiUpper(s : string) {
        let code = s.charCodeAt(0);
        return code >= Codes.A && code <= Codes.Z;
    }

    let unicodeNewlines = [0x000a, 0x000b, 0x000c, 0x0085, 0x2028, 0x2029];
    export function isUnicodeNewline(s : number) {
        return unicodeNewlines.includes(s);
    }
}