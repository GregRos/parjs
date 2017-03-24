/**
 * Created by User on 24-Nov-16.
 */
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
    var inlineSpaces = [0x0020, 0x0009];
    var mixedUnicodeInlineSpaces = [0x0009, 0x0020, 0x00a0, 0x1680, 0x180e, 0x0009, 0x202f, 0x205f, 0x3000];
    var unicodeNewlines = [0x0085, 0x2028, 0x2029];
    Codes.hairSpace = 0x200a;
    function isUnicodeInlineSpace(code) {
        return isBetween(code, Codes.enQuad, Codes.hairSpace) || mixedUnicodeInlineSpaces.includes(code);
    }
    Codes.isUnicodeInlineSpace = isUnicodeInlineSpace;
    function isInlineSpace(code) {
        return inlineSpaces.includes(code);
    }
    Codes.isInlineSpace = isInlineSpace;
    function isArithmeticSign(code) {
        return code === Codes.minus || code == Codes.plus;
    }
    Codes.isArithmeticSign = isArithmeticSign;
    function isBetween(code, start, end) {
        return code >= start && code <= end;
    }
    Codes.isBetween = isBetween;
    function isDigit(code, base) {
        if (base === void 0) { base = 10; }
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
    function isHex(code) {
        return isBetween(code, Codes.zero, Codes.nine) || isBetween(code, Codes.a, Codes.f) || isBetween(code, Codes.A, Codes.F);
    }
    Codes.isHex = isHex;
    function isAsciiLower(code) {
        return isBetween(code, Codes.a, Codes.z);
    }
    Codes.isAsciiLower = isAsciiLower;
    function isAsciiUpper(code) {
        return isBetween(code, Codes.A, Codes.Z);
    }
    Codes.isAsciiUpper = isAsciiUpper;
    function isAsciiLetter(code) {
        return isAsciiLower(code) || isAsciiUpper(code);
    }
    Codes.isAsciiLetter = isAsciiLetter;
    function isUnicodeNewline(s) {
        return unicodeNewlines.includes(s);
    }
    Codes.isUnicodeNewline = isUnicodeNewline;
})(Codes = exports.Codes || (exports.Codes = {}));
var Chars;
(function (Chars) {
    function isUpper(s) {
        return s.toUpperCase() === s;
    }
    Chars.isUpper = isUpper;
    function isLower(s) {
        return s.toLowerCase() === s;
    }
    Chars.isLower = isLower;
    function isDigit(s) {
        var code = s.charCodeAt(0);
        return Codes.isDigit(code);
    }
    Chars.isDigit = isDigit;
    function isAsciiLetter(s) {
        return Codes.isAsciiLetter(s.charCodeAt(0));
    }
    Chars.isAsciiLetter = isAsciiLetter;
    function isHex(s) {
        var code = s.charCodeAt(0);
        return Codes.isHex(code);
    }
    Chars.isHex = isHex;
    function isAsciiLower(s) {
        return Codes.isAsciiLower(s.charCodeAt(0));
    }
    Chars.isAsciiLower = isAsciiLower;
    function isTab(s) {
        var code = s.charCodeAt(0);
        return code === Codes.tab;
    }
    Chars.isTab = isTab;
    function isSpace(s) {
        var code = s.charCodeAt(0);
        return code === Codes.space;
    }
    Chars.isSpace = isSpace;
    function isInlineSpace(s) {
        var code = s.charCodeAt(0);
        return Codes.isInlineSpace(code);
    }
    Chars.isInlineSpace = isInlineSpace;
    function isUnicodeInlineSpace(s) {
        var code = s.charCodeAt(0);
        return Codes.isUnicodeInlineSpace(code);
    }
    Chars.isUnicodeInlineSpace = isUnicodeInlineSpace;
    //range: 0x2000 - 0x200a
    function isAsciiUpper(s) {
        var code = s.charCodeAt(0);
        return Codes.isAsciiUpper(code);
    }
    Chars.isAsciiUpper = isAsciiUpper;
})(Chars = exports.Chars || (exports.Chars = {}));
//# sourceMappingURL=char-indicators.js.map