import {LoudParser} from "../combinators/loud";
/**
 * Created by User on 20-Nov-16.
 */

export interface SpecialParsers {
    /**
     * P succeeds without consuming input and returns the current position in the input.
     */
    readonly position : LoudParser<number>;

    /**
     * P succeeds without consuming input and returns the current user state.
     */
    readonly state : LoudParser<any>;
}