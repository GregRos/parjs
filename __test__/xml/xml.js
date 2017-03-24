"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parsers_1 = require("../../src/bindings/parsers");
/**
 * Created by lifeg on 24/03/2017.
 */
var letterOrDigit = parsers_1.Parjs.asciiLetter.or(parsers_1.Parjs.digit);
var ident = parsers_1.Parjs.asciiLetter.then(letterOrDigit).str;
var quotedString = function (q) {
    var pQ = parsers_1.Parjs.char(q).quiet;
    return pQ.then(parsers_1.Parjs.noCharOf(q).many().str).then(pQ);
};
var pqSpaces = parsers_1.Parjs.spaces.quiet;
var attribute = ident.then(pqSpaces, parsers_1.Parjs.char("=").quiet, pqSpaces, quotedString("'").or(quotedString('"'))).map(function (_a) {
    var ident = _a[0], value = _a[1];
    return ({ name: ident, value: value });
});
var tag = parsers_1.Parjs.char('<').quiet.then(ident).then(parsers_1.Parjs.char('>').quiet);
//# sourceMappingURL=xml.js.map