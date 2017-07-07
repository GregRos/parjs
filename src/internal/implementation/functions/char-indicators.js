"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/functions
 */ /** */
//NOTE: Although we do use the char-info package for recognizing characters, it's very big and it's not always necessary.
//This code is copied over from char-info for the purpose of recognizing basic characters so we don't import it unless the user wants.
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
    Codes.maxAnsi = 0xff;
    Codes.carriageReturn = '\r'.charCodeAt(0);
    Codes.space = 0x0020;
    Codes.tab = 0x0008;
    Codes.minus = '-'.charCodeAt(0);
    Codes.plus = '+'.charCodeAt(0);
    Codes.decimalPoint = ".".charCodeAt(0);
    Codes.e = Codes.a + 4;
    Codes.E = Codes.A + 4;
    Codes.underscore = "_".charCodeAt(0);
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
var AsciiCodeInfo;
(function (AsciiCodeInfo) {
    function isAscii(code) {
        return code >= 0 && code <= Codes.maxAnsi;
    }
    AsciiCodeInfo.isAscii = isAscii;
    function isHex(code) {
        return code >= Codes.A && code <= Codes.F || code >= Codes.a && code <= Codes.f || code >= Codes.zero && code <= Codes.nine;
    }
    AsciiCodeInfo.isHex = isHex;
    function isDecimal(code) {
        return code >= Codes.zero && code <= Codes.nine;
    }
    AsciiCodeInfo.isDecimal = isDecimal;
    function isLetter(code) {
        return code >= Codes.a && code <= Codes.z || code >= Codes.A && code <= Codes.Z;
    }
    AsciiCodeInfo.isLetter = isLetter;
    function isUpper(code) {
        return code >= Codes.A && code <= Codes.Z;
    }
    AsciiCodeInfo.isUpper = isUpper;
    function isLower(code) {
        return code >= Codes.a && code <= Codes.z;
    }
    AsciiCodeInfo.isLower = isLower;
    function isNewline(code) {
        return code === Codes.carriageReturn || code === Codes.newline;
    }
    AsciiCodeInfo.isNewline = isNewline;
    function isSpace(code) {
        return code === Codes.space || code === Codes.tab;
    }
    AsciiCodeInfo.isSpace = isSpace;
    function isBinary(code) {
        return code === Codes.zero || code === Codes.zero + 1;
    }
    AsciiCodeInfo.isBinary = isBinary;
    function isWordChar(code) {
        return code >= Codes.A && code <= Codes.Z
            || code >= Codes.zero && code <= Codes.nine
            || code >= Codes.a && code <= Codes.z
            || code === Codes.underscore
            || code === Codes.minus;
    }
    AsciiCodeInfo.isWordChar = isWordChar;
})(AsciiCodeInfo = exports.AsciiCodeInfo || (exports.AsciiCodeInfo = {}));
var AsciiCharInfo;
(function (AsciiCharInfo) {
    function isAscii(code) {
        return AsciiCodeInfo.isAscii(code.charCodeAt(0));
    }
    AsciiCharInfo.isAscii = isAscii;
    function isHex(code) {
        return AsciiCodeInfo.isHex(code.charCodeAt(0));
    }
    AsciiCharInfo.isHex = isHex;
    function isDecimal(code) {
        return AsciiCodeInfo.isDecimal(code.charCodeAt(0));
    }
    AsciiCharInfo.isDecimal = isDecimal;
    function isLetter(code) {
        return AsciiCodeInfo.isLetter(code.charCodeAt(0));
    }
    AsciiCharInfo.isLetter = isLetter;
    function isUpper(code) {
        return AsciiCodeInfo.isUpper(code.charCodeAt(0));
    }
    AsciiCharInfo.isUpper = isUpper;
    function isLower(code) {
        return AsciiCodeInfo.isLower(code.charCodeAt(0));
    }
    AsciiCharInfo.isLower = isLower;
    function isNewline(code) {
        return AsciiCodeInfo.isNewline(code.charCodeAt(0));
    }
    AsciiCharInfo.isNewline = isNewline;
    function isSpace(code) {
        return AsciiCodeInfo.isSpace(code.charCodeAt(0));
    }
    AsciiCharInfo.isSpace = isSpace;
    function isBinary(code) {
        return AsciiCodeInfo.isBinary(code.charCodeAt(0));
    }
    AsciiCharInfo.isBinary = isBinary;
})(AsciiCharInfo = exports.AsciiCharInfo || (exports.AsciiCharInfo = {}));
//# sourceMappingURL=char-indicators.js.map