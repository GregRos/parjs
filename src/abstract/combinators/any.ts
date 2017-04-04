
import {LoudParser} from "./loud";
import {AnyParserAction} from "../basics/action";
import {QuietParser} from "./quiet";
/**
 * Created by User on 21-Nov-16.
 */
export interface AnyParser {
    readonly displayName : string;
    /**
     * Exposes the internal parser action. This bit will generally contain the implementation of the parser instance.
     */
    readonly action : AnyParserAction;
    /**
     * P applies this parser, and if it succeeds, returns the given value.
     * @param result The value to return.
     */
    result<S>(result : S) : LoudParser<S>;

    /**
     * P applies this parser and forgets the result (if any).
     */
    readonly q : QuietParser;

    /**
     * P applies this parser and succeeds without consuming input if this parser fails. P fails if this parser succeeds.
     */
    readonly not : QuietParser;

    /**
     * P discards the result of this parser, if any, and instead returns its parser state.
     */
    readonly state : LoudParser<any>;


    /**
     * P verifies that the parsing state matches the predicate or fails hard.
     * @param predicate The predicate to verify.
     */
    mustState(predicate : (state : any) => boolean);

    readonly isLoud : boolean;

    /**
     * P applies this parser and maps the result to a string.
     * This is done differently depending on what this parser returns.
     * For an array (usually of strings), the elements are concatenated and returned as a single string.
     * For a quiet parser, an empty string is returned.
     * For a number, it is turned into a string.
     * For a symbol, its description text is returned.
     * For an object, its toString method is invoked.
     */
    readonly str : LoudParser<string>;
}