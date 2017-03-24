"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
/**
 * Created by User on 28-Nov-16.
 */
var _ = require("lodash");
var char_indicators_1 = require("../../../functions/char-indicators");
var parselets_1 = require("./parselets");
var result_1 = require("../../../abstract/basics/result");
var defaultFloatOptions = {
    allowExponent: true,
    allowSign: true,
    allowImplicitZero: true,
    allowFloatingPoint: true
};
var msgOneOrMoreDigits = "one or more digits";
var msgExponentSign = "exponent sign (+ or -)";
var PrsFloat = (function (_super) {
    tslib_1.__extends(PrsFloat, _super);
    function PrsFloat(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.expecting = "a floating-point number";
        _this.displayName = "float";
        _this.isLoud = true;
        _this.options = _.defaults(options, defaultFloatOptions);
        return _this;
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
        var _a = this.options, allowSign = _a.allowSign, allowFloatingPoint = _a.allowFloatingPoint, allowImplicitZero = _a.allowImplicitZero, allowExponent = _a.allowExponent;
        var position = ps.position, input = ps.input;
        if (position >= input.length) {
            ps.kind = result_1.ResultKind.SoftFail;
            return;
        }
        var initPos = position;
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
        parselets_1.Parselets.parseDigitsInBase(ps, 10);
        hasWhole = ps.position !== prevPos;
        //now if allowFloatingPoint, we try to parse a decimal point.
        var nextChar = input.charCodeAt(ps.position);
        prevPos = ps.position;
        if (!allowImplicitZero && !hasWhole) {
            //fail because we don't allow ".1", and similar without allowImplicitZero.
            ps.kind = hasSign ? result_1.ResultKind.HardFail : result_1.ResultKind.SoftFail;
            ps.expecting = msgOneOrMoreDigits;
            return;
        }
        floatingParse: {
            if (allowFloatingPoint && nextChar === char_indicators_1.Codes.decimalPoint) {
                //skip to the char after the decimal point
                ps.position++;
                var prevFractionalPos = ps.position;
                //parse the fractional part
                parselets_1.Parselets.parseDigitsInBase(ps, 10);
                hasFraction = prevFractionalPos !== ps.position;
                if (!allowImplicitZero && !hasFraction) {
                    //we encountered something like 212. but allowImplicitZero is false.
                    //that means we need to backtrack to the . character and succeed in parsing the integer.
                    //the remainder is not a valid number.
                    break floatingParse;
                }
                //after parseDigits has been invoked, the ps.position is on the next character (which could be e).
                nextChar = input.charCodeAt(ps.position);
                prevPos = ps.position;
            }
            if (!hasWhole && !hasFraction) {
                //even if allowImplicitZero is true, we still don't parse '.' as '0.0'.
                ps.kind = hasSign ? result_1.ResultKind.HardFail : result_1.ResultKind.SoftFail;
                ps.expecting = msgOneOrMoreDigits;
                return;
            }
            //note that if we don't allow floating point, the char that might've been '.' will instead be 'e' or 'E'.
            //if we do allow floating point, then the previous block would've consumed some characters.
            if (allowExponent && (nextChar === char_indicators_1.Codes.e || nextChar === char_indicators_1.Codes.E)) {
                ps.position++;
                var expSign = parselets_1.Parselets.parseSign(ps);
                if (expSign === 0) {
                    ps.kind = result_1.ResultKind.HardFail;
                    ps.expecting = msgExponentSign;
                    return;
                }
                var prevFractionalPos = ps.position;
                parselets_1.Parselets.parseDigitsInBase(ps, 10);
                if (ps.position === prevFractionalPos) {
                    //we parsed e+ but we did not parse any digits.
                    ps.kind = result_1.ResultKind.HardFail;
                    ps.expecting = msgOneOrMoreDigits;
                    return;
                }
            }
        }
        ps.kind = result_1.ResultKind.OK;
        ps.value = parseFloat(input.substring(initPos, ps.position));
    };
    return PrsFloat;
}(action_1.ParjsAction));
exports.PrsFloat = PrsFloat;
//# sourceMappingURL=float.js.map