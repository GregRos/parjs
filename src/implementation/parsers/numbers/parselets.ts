import {FastMath} from "../../../functions/math";
import {Codes} from "../../../functions/char-indicators";
import {ParsingState} from "../../../abstract/basics/state";
/**
 * Created by User on 29-Nov-16.
 */

export class _ParseletsType {
    /**
     * Tries to parse a sequence of digits in {base}. Returns a positive number consisting of the parsed digits.
     * Returns < 0 if no digits were parsed.
     * @param ps
     * @param base
     * @param exponents
     * @returns {number}
     */
    parseDigits(ps : ParsingState, base : number, exponents : number[][]) {
        let {position, input} = ps;
        let result = 0;
        let length = input.length;
        let expLength = exponents.length;
        for (let i = 0; position < length; position++, i++) {
            let curCode = input.charCodeAt(position);
            if (!Codes.isDigit(curCode, base)) {
                break;
            }
            result += Codes.digitValue(curCode);
        }
        ps.position = position;
        return result;
    }

    /**
     * Tries to parse a '+' or '-'. Returns the sign that was parsed, or 0 if the parsing failed.
     * @param ps
     * @returns {number}
     */
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
}

export const Parselets = new _ParseletsType();