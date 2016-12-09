import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by User on 29-Nov-16.
 */
export declare class _ParseletsType {
    /**
     * Tries to parse a sequence of digits in {base}. Returns a positive number consisting of the parsed digits.
     * Returns < 0 if no digits were parsed.
     * @param ps
     * @param base
     * @param exponents
     * @returns {number}
     */
    parseDigits(ps: ParsingState, base: number, exponents: number[][]): number;
    /**
     * Tries to parse a '+' or '-'. Returns the sign that was parsed, or 0 if the parsing failed.
     * @param ps
     * @returns {number}
     */
    parseSign(ps: ParsingState): number;
}
export declare const Parselets: _ParseletsType;
