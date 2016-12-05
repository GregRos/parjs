"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
/**
 * Created by User on 28-Nov-16.
 */
var _ = require('lodash');
var char_indicators_1 = require("../../../functions/char-indicators");
var math_1 = require("../../../functions/math");
var parselets_1 = require("./parselets");
var defaultFloatOptions = {
    allowExponent: true,
    allowSign: true,
    allowImplicitZero: true,
    base: 10,
    allowFloatingPoint: true
};
var PrsFloat = (function (_super) {
    __extends(PrsFloat, _super);
    function PrsFloat(options) {
        _super.call(this);
        this.expecting = "a floating-point number";
        this.displayName = "float";
        this.isLoud = true;
        _.defaults(options, defaultFloatOptions);
    }
    PrsFloat.prototype._apply = function (ps) {
        /*
            This work is really better done using Parjs itself, but it's wrapped in (mostly) a single parser for efficiency purposes.

            We want a configurable number parser that can parse floating point numbers in any base, with or without a sign, and with or without
            an exponent...

            Here are the rules of this parser.

            Replace {1,2 3, 4} by the digits allowed with the base, which is configurable.

            BASIC NUMBER FORMS - parser must be one of:
                a. 1234 : integer
                b. 12.3 : floating point, allowed if {allowFloatingPoint}.
                c. .123 : floating point, implicit whole part. Requires {allowFloatingPoint && allowImplicitZero}
                d. 123. : floating point, implicit fractional part. Requires {allowFloatingPoint && allowImplicitZero}

            CONFIGURABLE EXTRAS:
                a. Sign prefix: (+|-) preceeding the number. Allowed if {allowSign}.
                b. Exponent suffix: (e|E)(+|-)\d+. Allowed if {allowExponent}. Can be combined with {!allowFloatingPoint}.

            FAILURES:
                a. '' - no characters consumed. Parser fails.
                b. '.' - could be understood as an implicit 0.0, but will not be parsed by this parser.
                c. '1e+' -
                    with {allowExponent}, this fails after consuming '1e+' because it expected an integer after the + but didn't find one.
                    without that flag, this succeeds and parses just 1.

            SUCCESSES:
                a. '1abc' - The parser will just consume and return 1.
                b. '10e+1' - {allowExponent} can be true even if {allowFloatingPoint} isn't.

            ISSUES:
                a. If base >= 15 then the character 'e' is a digit and so {allowExponent} must be false since it cannot be parsed.
                   Otherwise, an error is thrown.
                b.
         */
        var _a = this.options, allowSign = _a.allowSign, allowFloatingPoint = _a.allowFloatingPoint, allowImplicitZero = _a.allowImplicitZero, allowExponent = _a.allowExponent, base = _a.base;
        var position = ps.position, input = ps.input;
        if (position > input.length) {
            ps.result = ResultKind.SoftFail;
            return;
        }
        ;
        var Sign = 1;
        var hasSign = false, hasWhole = false, hasFraction = false;
        if (allowSign) {
            //try parse a sign
            Sign = parselets_1.Parselets.parseSign(ps);
            if (Sign === 0) {
                Sign = 1;
            }
            else {
                hasSign = true;
            }
        }
        //after a sign there needs to come an integer part (if any).
        var prevPos = ps.position;
        var Whole = parselets_1.Parselets.parseDigits(ps, base, math_1.FastMath.PositiveExponents);
        var Fractional = 0;
        var Exp = 1;
        hasWhole = ps.position !== prevPos;
        //now if allowFloatingPoint, we try to parse a decimal point.
        var nextChar = input.charCodeAt(ps.position);
        prevPos = ps.position;
        if (!allowImplicitZero && !hasWhole) {
            //fail because we don't allow ".1", and similar without allowImplicitZero.
            ps.result = ResultKind.SoftFail;
            return;
        }
        if (allowFloatingPoint && nextChar === char_indicators_1.Codes.decimalPoint) {
            //skip to the char after the decimal point
            ps.position++;
            var prevFractionalPos = ps.position;
            //parse the fractional part
            Fractional = parselets_1.Parselets.parseDigits(ps, base, math_1.FastMath.NegativeExponents);
            hasFraction = prevFractionalPos !== ps.position;
            if (!allowImplicitZero && !hasFraction) {
                //we encountered something like 212. but allowImplicitZero is false.
                //that means we need to backtrack to the . character and succeed in parsing the integer.
                //the remainder is not a valid number.
                ps.value = Whole;
                ps.position = prevPos;
                return;
            }
            //after parseDigits has been invoked, the ps.position is on the next character (which could be e).
            nextChar = input.charCodeAt(ps.position);
            prevPos = ps.position;
        }
        if (!hasWhole && !hasFraction) {
            //even if allowImplicitZero is true, we still don't parse '.' as '0.0'.
            ps.result = ResultKind.SoftFail;
            return;
        }
        //note that if we don't allow floating point, the char that might've been '.' will instead be 'e' or 'E'.
        //if we do allow floating point, then the previous block would've consumed some characters.
        if (allowExponent && (nextChar === char_indicators_1.Codes.e || nextChar === char_indicators_1.Codes.E)) {
            ps.position++;
            var expSign = parselets_1.Parselets.parseSign(ps);
            if (expSign === 0) {
                ps.result = ResultKind.HardFail;
                return;
            }
            var prevFractionalPos = ps.position;
            var exp = parselets_1.Parselets.parseDigits(ps, base, math_1.FastMath.PositiveExponents);
            if (ps.position === prevFractionalPos) {
                //we parsed e+ but we did not parse any digits.
                ps.result = ResultKind.HardFail;
                return;
            }
            if (expSign < 0) {
                Exp = math_1.FastMath.NegativeExponents[base][exp];
            }
            else {
                Exp = math_1.FastMath.PositiveExponents[base][exp];
            }
        }
        ps.result = ResultKind.OK;
        ps.value = Sign * (Whole + Fractional) * Exp;
    };
    return PrsFloat;
}(action_1.ParjsParserAction));
exports.PrsFloat = PrsFloat;
//# sourceMappingURL=float.js.map