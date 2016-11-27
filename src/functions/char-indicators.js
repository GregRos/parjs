/**
 * Created by User on 24-Nov-16.
 */
"use strict";
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
    Codes.enQuad = 0x2000;
    Codes.hairSpace = 0x200a;
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
        return code >= Codes.zero || code <= Codes.nine;
    }
    Chars.isDigit = isDigit;
    function isHex(s) {
        var code = s.charCodeAt(0);
        return code >= Codes.zero && code <= Codes.nine || code >= Codes.a && code <= Codes.f || code >= Codes.A && code <= Codes.F;
    }
    Chars.isHex = isHex;
    function isAsciiLower(s) {
        var code = s.charCodeAt(0);
        return code >= Codes.a && code <= Codes.z;
    }
    Chars.isAsciiLower = isAsciiLower;
    function isTab(s) {
        var code = s.charCodeAt(0);
        return code === 0x0008;
    }
    Chars.isTab = isTab;
    function isSpace(s) {
        var code = s.charCodeAt(0);
        return code === 0x0020;
    }
    Chars.isSpace = isSpace;
    var inlineSpaces = [0x0020, 0x0009];
    function isInlineSpace(s) {
        var code = s.charCodeAt(0);
        return inlineSpaces.includes(code);
    }
    Chars.isInlineSpace = isInlineSpace;
    var mixedUicodeInlineSpaces = [0x0009, 0x0020, 0x00a0, 0x1680, 0x180e, 0x0009, 0x202f, 0x205f, 0x3000];
    function isUnicodeInlineSpace(s) {
        var code = s.charCodeAt(0);
        return code >= 0x2000 && code <= 0x200a || mixedUicodeInlineSpaces.includes(code);
    }
    Chars.isUnicodeInlineSpace = isUnicodeInlineSpace;
    //range: 0x2000 - 0x200a
    function isAsciiUpper(s) {
        var code = s.charCodeAt(0);
        return code >= Codes.A && code <= Codes.Z;
    }
    Chars.isAsciiUpper = isAsciiUpper;
    var unicodeNewlines = [0x000a, 0x000b, 0x000c, 0x0085, 0x2028, 0x2029];
    function isUnicodeNewline(s) {
        return unicodeNewlines.includes(s);
    }
    Chars.isUnicodeNewline = isUnicodeNewline;
})(Chars = exports.Chars || (exports.Chars = {}));
//# sourceMappingURL=char-indicators.js.map