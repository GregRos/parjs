/**
 * @module parjs/internal/implementation/parsers
 */
/** */
import {ParjsAction} from "../../action";
import {Codes} from "../../functions/char-indicators";

import {Parselets} from "./parselets";
import {ReplyKind} from "../../../../reply";
import {ParsingState} from "../../state";
/**
 * Created by User on 28-Nov-16.
 */
import _defaults = require("lodash/defaults");
import {BaseParjsParser} from "../../parser";
import {LoudParser} from "../../../../loud";

export interface FloatOptions {
    allowSign?: boolean;
    allowImplicitZero?: boolean;
    allowFloatingPoint?: boolean;
    allowExponent?: boolean;
}

const defaultFloatOptions: FloatOptions = {
    allowExponent: true,
    allowSign: true,
    allowImplicitZero: true,
    allowFloatingPoint: true
};

const msgOneOrMoreDigits = "one or more digits";
const msgExponentSign = "exponent sign (+ or -)";

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
export function float(options = defaultFloatOptions): LoudParser<number> {
    return new class Float extends BaseParjsParser {
        displayName = "float";
        expecting = "a floating-point number";
        isLoud: true = true;

        _apply(ps: ParsingState): void {

            let {allowSign, allowFloatingPoint, allowImplicitZero, allowExponent} = options;
            let {position, input} = ps;
            if (position >= input.length) {
                ps.kind = ReplyKind.SoftFail;
                return;
            }
            let initPos = position;
            let sign = 1;
            let hasSign = false, hasWhole = false, hasFraction = false;
            if (allowSign) {
                //try parse a sign
                sign = Parselets.parseSign(ps);
                if (sign === 0) {
                    sign = 1;
                } else {
                    hasSign = true;
                }
            }
            //after a sign there needs to come an integer part (if any).
            let prevPos = ps.position;
            Parselets.parseDigitsInBase(ps, 10);
            hasWhole = ps.position !== prevPos;
            //now if allowFloatingPoint, we try to parse a decimal point.
            let nextChar = input.charCodeAt(ps.position);
            prevPos = ps.position;
            if (!allowImplicitZero && !hasWhole) {
                //fail because we don't allow ".1", and similar without allowImplicitZero.
                ps.kind = hasSign ? ReplyKind.HardFail : ReplyKind.SoftFail;
                ps.expecting = msgOneOrMoreDigits;
                return;
            }
            // tslint:disable-next-line:label-position
            floatingParse: {
                if (allowFloatingPoint && nextChar === Codes.decimalPoint) {
                    //skip to the char after the decimal point
                    ps.position++;
                    let prevFractionalPos = ps.position;
                    //parse the fractional part
                    Parselets.parseDigitsInBase(ps, 10);
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
                    ps.kind = hasSign ? ReplyKind.HardFail : ReplyKind.SoftFail;
                    ps.expecting = msgOneOrMoreDigits;
                    return;
                }
                //note that if we don't allow floating point, the char that might've been '.' will instead be 'e' or 'E'.
                //if we do allow floating point, then the previous block would've consumed some characters.
                if (allowExponent && (nextChar === Codes.e || nextChar === Codes.E)) {
                    ps.position++;
                    let expSign = Parselets.parseSign(ps);
                    if (expSign === 0) {
                        ps.kind = ReplyKind.HardFail;
                        ps.expecting = msgExponentSign;
                        return;
                    }
                    let prevFractionalPos = ps.position;
                    Parselets.parseDigitsInBase(ps, 10);
                    if (ps.position === prevFractionalPos) {
                        //we parsed e+ but we did not parse any digits.
                        ps.kind = ReplyKind.HardFail;
                        ps.expecting = msgOneOrMoreDigits;
                        return;
                    }
                }
            }
            ps.kind = ReplyKind.Ok;
            ps.value = parseFloat(input.substring(initPos, ps.position));
        }

    }();
}
