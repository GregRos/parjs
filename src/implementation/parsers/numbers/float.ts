import {JaseParserAction} from "../../../base/parser-action";
/**
 * Created by User on 28-Nov-16.
 */
import _ = require('lodash');
import {Codes} from "../../../functions/char-indicators";
import decimalPoint = Codes.decimalPoint;
import {FastMath} from "../../../functions/math";
import NegativeExponents = FastMath.NegativeExponents;

export interface FloatOptions {
    allowSign ?: boolean;
    allowImplicitZero ?: boolean;
    allowFractional ?: boolean;
    allowExponent ?: boolean;
    base ?: number;
}

const defaultFloatOptions : FloatOptions = {
    allowExponent : true,
    allowSign : true,
    allowImplicitZero : true,
    base : 10,
    allowFractional : true
};

export class PrsFloat extends JaseParserAction {
    private options : FloatOptions & {decimalSeparator : number, exponentIndicators : number[]};
    constructor(options : FloatOptions) {
        super();
        _.defaults(options, defaultFloatOptions);
    }

    parseSign(ps : ParsingState) {
        let sign = 0;
        let curChar = ps.input.charCodeAt(ps.position);
        if (curChar === Codes.minus) {
            sign = -1;
            ps.position++;
        } else if (curChar === Codes.plus) {
            ps.position++;
        }
        return sign;
    }

    parseDigits(ps : ParsingState, positiveExponent : boolean) {
        let {position, input} = ps;
        let {options : {base}} = this;
        let exponents = positiveExponent ? FastMath.PositiveExponents : FastMath.NegativeExponents;
        let result = 0;
        for (let i = 0; position < input.length; position++, i++) {
            let curCode = input.charCodeAt(position);
            if (!Codes.isDigit(curCode, base)) {
                break;
            }
            result += Codes.digitValue(curCode) * exponents[i];
        }

        ps.position = position;
        return result;

    }
    _apply(ps : ParsingState) {
        let {options : {allowSign, allowFractional, allowImplicitZero, allowExponent, base}} = this;
        let {position, input} = ps;
        let len = input.length;
        if (position > len) return false;
        let result = 0;
        let sign = 1;
        if (allowSign) {
            sign = this.parseSign(ps);
            sign = sign === 0 ? 1 : sign;
        }
        result += this.parseDigits(ps, true);
        if (!allowImplicitZero && ps.position === position) {
            //fail because we don't allow "e+14", ".1", and similar without allowImplicitZero.
            return false;
        }
        let nextChar = input.charCodeAt(ps.position);

        if (allowFractional && nextChar === Codes.decimalPoint) {
            ps.position++;
            position = ps.position;
            result += this.parseDigits(ps, false);
            if (!allowImplicitZero && ps.position === position) {
                //fail because we don't allow "1.", "1.e+14", etc.
                return false;
            }
            nextChar = input.charCodeAt(ps.position);
        }
        if (allowExponent && (nextChar === Codes.e || nextChar === Codes.E)) {
            ps.position++;
            let sign = this.parseSign(ps);
            if (sign === 0) {
                //fail because expected a + or -
                return false;
            }
            let position = ps.position;
            let exp = this.parseDigits(ps, true);
            if (position === ps.position) {
                //fail because expected at least one digit after the sign for an exponent.
                return false;
            }
            if (sign < 0) {
                result *= FastMath.NegativeExponents[exp];
            } else {
                result *= FastMath.PositiveExponents[exp];
            }
        }
    }
}