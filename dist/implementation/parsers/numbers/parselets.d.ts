import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by User on 29-Nov-16.
 */
export declare class _ParseletsType {
    parseDigitsInBase(ps: ParsingState, base: number): number;
    /**
     * Tries to parse a '+' or '-'. Returns the sign that was parsed, or 0 if the parsing failed.
     * @param ps
     * @returns {number}
     */
    parseSign(ps: ParsingState): number;
}
export declare const Parselets: _ParseletsType;
