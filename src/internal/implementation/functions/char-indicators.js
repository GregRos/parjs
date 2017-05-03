/**
 * @module parjs/internal/implementation/functions
 */ /** */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Codes;
(function (Codes) {
    Codes.a = 'a'.charCodeAt(0);
    Codes.f = 'f'.charCodeAt(0);
    Codes.F = 'F'.charCodeAt(0);
    Codes.z = 'z'.charCodeAt(0);
    Codes.A = 'A'.charCodeAt(0);
    Codes.Z = 'Z'.charCodeAt(0);
    Codes.zero = '0'.charCodeAt(0);
    Codes.nine = '9'.charCodeAt(0);
    Codes.newline = '\n'.charCodeAt(0);
    Codes.carriageReturn = '\r'.charCodeAt(0);
    Codes.space = 0x0020;
    Codes.tab = 0x0008;
    Codes.minus = '-'.charCodeAt(0);
    Codes.plus = '+'.charCodeAt(0);
    Codes.decimalPoint = ".".charCodeAt(0);
    Codes.e = Codes.a + 4;
    Codes.E = Codes.A + 4;
    Codes.enQuad = 0x2000;
    const inlineSpaces = [0x0020, 0x0009];
    const mixedUnicodeInlineSpaces = [0x0009, 0x0020, 0x00a0, 0x1680, 0x180e, 0x0009, 0x202f, 0x205f, 0x3000];
    let unicodeNewlines = [0x0085, 0x2028, 0x2029];
    Codes.hairSpace = 0x200a;
    function isBetween(code, start, end) {
        return code >= start && code <= end;
    }
    Codes.isBetween = isBetween;
    function isDigit(code, base = 10) {
        if (base <= 10) {
            return isBetween(code, Codes.zero, Codes.zero + base - 1);
        }
        if (base <= 37) {
            return isBetween(code, Codes.zero, Codes.nine) || isBetween(code, Codes.a, Codes.a + base - 11) || isBetween(code, Codes.A, Codes.A + base - 11);
        }
        return undefined;
    }
    Codes.isDigit = isDigit;
    function digitValue(code) {
        if (isBetween(code, Codes.zero, Codes.nine)) {
            return code - Codes.zero;
        }
        if (isBetween(code, Codes.a, Codes.z)) {
            return 10 + code - Codes.a;
        }
        if (isBetween(code, Codes.A, Codes.Z)) {
            return 10 + code - Codes.A;
        }
        return undefined;
    }
    Codes.digitValue = digitValue;
})(Codes = exports.Codes || (exports.Codes = {}));
//# sourceMappingURL=char-indicators.js.map