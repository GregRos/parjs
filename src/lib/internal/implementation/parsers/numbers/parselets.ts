/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import {Codes} from "../../functions/char-indicators";
import {ParsingState} from "../../state";
/**
 * Created by User on 29-Nov-16.
 */

export class ParseletsType {

    parseDigitsInBase(ps : ParsingState, base : number) {
        let {position, input} = ps;
        let length = input.length;
        let result = 0;
        for (; position < length ; position++) {
            let curCode = input.charCodeAt(position);
            if (!Codes.isDigit(curCode, base)) {
                break;
            }
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
            sign = 1;
        }
        return sign;
    }
}

export const Parselets = new ParseletsType();