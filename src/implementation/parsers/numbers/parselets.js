"use strict";
var char_indicators_1 = require("../../../functions/char-indicators");
/**
 * Created by User on 29-Nov-16.
 */
var _ParseletsType = (function () {
    function _ParseletsType() {
    }
    /**
     * Tries to parse a sequence of digits in {base}. Returns a positive number consisting of the parsed digits.
     * Returns < 0 if no digits were parsed.
     */
    _ParseletsType.prototype.parseDigits = function (ps, base, exponents) {
        var position = ps.position, input = ps.input;
        var result = 0;
        var length = input.length;
        var expLength = exponents.length;
        for (var i = 0; position < length; position++, i++) {
            var curCode = input.charCodeAt(position);
            if (!char_indicators_1.Codes.isDigit(curCode, base)) {
                break;
            }
            result += exponents[i] * char_indicators_1.Codes.digitValue(curCode);
        }
        ps.position = position - 1;
        return result;
    };
    /**
     * Tries to parse a '+' or '-'. Returns the sign that was parsed, or 0 if the parsing failed.
     * @param ps
     * @returns {number}
     */
    _ParseletsType.prototype.parseSign = function (ps) {
        var sign = 0;
        var curChar = ps.input.charCodeAt(ps.position);
        if (curChar === char_indicators_1.Codes.minus) {
            sign = -1;
            ps.position++;
        }
        else if (curChar === char_indicators_1.Codes.plus) {
            ps.position++;
            sign = 1;
        }
        return sign;
    };
    return _ParseletsType;
}());
exports._ParseletsType = _ParseletsType;
exports.Parselets = new _ParseletsType();
//# sourceMappingURL=parselets.js.map