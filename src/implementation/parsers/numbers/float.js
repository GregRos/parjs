"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
/**
 * Created by User on 28-Nov-16.
 */
var _ = require('lodash');
var char_indicators_1 = require("../../../functions/char-indicators");
var math_1 = require("../../../functions/math");
var defaultFloatOptions = {
    allowExponent: true,
    allowSign: true,
    allowImplicitZero: true,
    base: 10,
    allowFractional: true
};
var PrsFloat = (function (_super) {
    __extends(PrsFloat, _super);
    function PrsFloat(options) {
        _super.call(this);
        _.defaults(options, defaultFloatOptions);
    }
    PrsFloat.prototype.parseSign = function (ps) {
        var sign = 0;
        var curChar = ps.input.charCodeAt(ps.position);
        if (curChar === char_indicators_1.Codes.minus) {
            sign = -1;
            ps.position++;
        }
        else if (curChar === char_indicators_1.Codes.plus) {
            ps.position++;
        }
        return sign;
    };
    PrsFloat.prototype.parseDigits = function (ps, positiveExponent) {
        var position = ps.position, input = ps.input;
        var base = this.options.base;
        var exponents = positiveExponent ? math_1.FastMath.PositiveExponents : math_1.FastMath.NegativeExponents;
        var result = 0;
        for (var i = 0; position < input.length; position++, i++) {
            var curCode = input.charCodeAt(position);
            if (!char_indicators_1.Codes.isDigit(curCode, base)) {
                break;
            }
            result += char_indicators_1.Codes.digitValue(curCode) * exponents[i];
        }
        ps.position = position;
        return result;
    };
    PrsFloat.prototype._apply = function (ps) {
        var _a = this.options, allowSign = _a.allowSign, allowFractional = _a.allowFractional, allowImplicitZero = _a.allowImplicitZero, allowExponent = _a.allowExponent, base = _a.base;
        var position = ps.position, input = ps.input;
        var len = input.length;
        if (position > len)
            return false;
        var result = 0;
        var sign = 1;
        if (allowSign) {
            sign = this.parseSign(ps);
            sign = sign === 0 ? 1 : sign;
        }
        result += this.parseDigits(ps, true);
        if (!allowImplicitZero && ps.position === position) {
            //fail because we don't allow "e+14", ".1", and similar without allowImplicitZero.
            return false;
        }
        var nextChar = input.charCodeAt(ps.position);
        if (allowFractional && nextChar === char_indicators_1.Codes.decimalPoint) {
            ps.position++;
            position = ps.position;
            result += this.parseDigits(ps, false);
            if (!allowImplicitZero && ps.position === position) {
                //fail because we don't allow "1.", "1.e+14", etc.
                return false;
            }
            nextChar = input.charCodeAt(ps.position);
        }
        if (allowExponent && (nextChar === char_indicators_1.Codes.e || nextChar === char_indicators_1.Codes.E)) {
            ps.position++;
            var sign_1 = this.parseSign(ps);
            if (sign_1 === 0) {
                //fail because expected a + or -
                return false;
            }
            var position_1 = ps.position;
            var exp = this.parseDigits(ps, true);
            if (position_1 === ps.position) {
                //fail because expected at least one digit after the sign for an exponent.
                return false;
            }
            if (sign_1 < 0) {
                result *= math_1.FastMath.NegativeExponents[exp];
            }
            else {
                result *= math_1.FastMath.PositiveExponents[exp];
            }
        }
    };
    return PrsFloat;
}(parser_action_1.JaseParserAction));
exports.PrsFloat = PrsFloat;
//# sourceMappingURL=float.js.map