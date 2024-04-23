import { AsciiCodes, isDigitCode } from "char-info/ascii";
import type { ParsingState } from "../state";

/** Parsing helper. */
export class NumericHelpersType {
    parseDigitsInBase(ps: ParsingState, base: number) {
        let { position } = ps;
        const { input } = ps;
        const length = input.length;
        const result = 0;
        for (; position < length; position++) {
            const curCode = input.charCodeAt(position);
            if (!isDigitCode(curCode, base)) {
                break;
            }
        }
        ps.position = position;
        return result;
    }

    /**
     * Tries to parse a '+' or '-'. Returns the sign that was parsed, or 0 if the parsing failed.
     *
     * @param ps
     * @returns {number}
     */
    parseSign(ps: ParsingState) {
        let sign = 0;
        const curChar = ps.input.charCodeAt(ps.position);
        if (curChar === AsciiCodes.minus) {
            sign = -1;
            ps.position++;
        } else if (curChar === AsciiCodes.plus) {
            ps.position++;
            sign = 1;
        }
        return sign;
    }
}

export const NumericHelpers = new NumericHelpersType();
