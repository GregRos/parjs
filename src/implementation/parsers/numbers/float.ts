import {ParjsAction} from "../../../base/action";
/**
 * Created by User on 28-Nov-16.
 */
import _ = require('lodash');
import {Codes} from "../../../functions/char-indicators";
import decimalPoint = Codes.decimalPoint;
import {FastMath} from "../../../functions/math";
import NegativeExponents = FastMath.NegativeExponents;
import {Parselets} from "./parselets";
import {ResultKind} from "../../../abstract/basics/result";
import {ParsingState} from "../../../abstract/basics/state";

export interface FloatOptions {
    allowSign ?: boolean;
    allowImplicitZero ?: boolean;
    allowFloatingPoint ?: boolean;
    allowExponent ?: boolean;
    base ?: number;
}

const defaultFloatOptions : FloatOptions = {
    allowExponent : true,
    allowSign : true,
    allowImplicitZero : true,
    base : 10,
    allowFloatingPoint : true
};

const msgOneOrMoreDigits = "one or more digits";
const msgExponentSign = "exponent sign (+ or -)";
export class PrsFloat extends ParjsAction {
    private options : FloatOptions & {decimalSeparator : number, exponentIndicators : number[]};
    expecting = "a floating-point number";
    displayName = "float";
    isLoud = true;
    constructor(options : FloatOptions) {
        super();
        _.defaults(options, defaultFloatOptions);
    }

    _apply(ps : ParsingState) {
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
        let {options : {allowSign, allowFloatingPoint, allowImplicitZero, allowExponent, base}} = this;
        let {position, input} = ps;
        if (position > input.length) {
            ps.kind = ResultKind.SoftFail;
            return;
        }
        let Sign = 1;
        let hasSign = false, hasWhole = false, hasFraction = false;
        if (allowSign) {
            //try parse a sign
            Sign = Parselets.parseSign(ps);
            if (Sign === 0) {
                Sign = 1;
            } else {
                hasSign = true;
            }
        }
        //after a sign there needs to come an integer part (if any).
        let prevPos = ps.position;
        let Whole = Parselets.parseDigits(ps, base, FastMath.PositiveExponents);
        let Fractional = 0;
        let Exp = 1;
        hasWhole = ps.position !== prevPos;
        //now if allowFloatingPoint, we try to parse a decimal point.
        let nextChar = input.charCodeAt(ps.position);
        prevPos = ps.position;
        if (!allowImplicitZero && !hasWhole) {
            //fail because we don't allow ".1", and similar without allowImplicitZero.
            ps.kind = ResultKind.SoftFail;
            ps.expecting = msgOneOrMoreDigits;
            return;
        }
        if (allowFloatingPoint && nextChar === Codes.decimalPoint) {

            //skip to the char after the decimal point
            ps.position++;
            let prevFractionalPos = ps.position;
            //parse the fractional part
            Fractional = Parselets.parseDigits(ps, base, FastMath.NegativeExponents);
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
            ps.kind = ResultKind.SoftFail;
            ps.expecting = msgOneOrMoreDigits;
            return;
        }
        //note that if we don't allow floating point, the char that might've been '.' will instead be 'e' or 'E'.
        //if we do allow floating point, then the previous block would've consumed some characters.
        if (allowExponent && (nextChar === Codes.e || nextChar === Codes.E)) {
            ps.position++;
            let expSign = Parselets.parseSign(ps);
            if (expSign === 0) {
                ps.kind = ResultKind.HardFail;
                ps.expecting = msgExponentSign;
                return;
            }
            let prevFractionalPos = ps.position;
            let exp = Parselets.parseDigits(ps, base, FastMath.PositiveExponents);
            if (ps.position === prevFractionalPos) {
                //we parsed e+ but we did not parse any digits.
                ps.kind = ResultKind.HardFail;
                ps.expecting = msgOneOrMoreDigits;
                return;
            }
            if (expSign < 0) {
                Exp =  FastMath.NegativeExponents[base][exp];
            } else {
                Exp =  FastMath.PositiveExponents[base][exp];
            }
        }

        ps.kind = ResultKind.OK;
        ps.value = Sign * (Whole + Fractional) * Exp;
    }
}