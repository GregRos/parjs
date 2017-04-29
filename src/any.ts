/**
 * @module parjs
 */ /** */
import {LoudParser} from "./loud";
import {AnyParserAction} from "./internal/action";
import {QuietParser} from "./quiet";
/**
 * Common interface that unites parsers that produce values and ones that don't.
 * @see LoudParser
 * @see QuietParser
 */
export interface AnyParser {
    /**
     * Exposes the display name of the parser. Userful when debugging.
     */
    readonly displayName : string;
    /**
     * Exposes the internal parser action. This will generally contain the implementation of the parser instance.
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
     * P applies this parser and succeeds without consuming input if this parser fails.
     */
    readonly not : QuietParser;

    /**
     * P discards the result of this parser, if any, and instead returns its parser state.
     */
    readonly state : LoudParser<any>;

    /**
     * Whether the parser results in a value. Parsers cannot change their loudness.
     */
    readonly isLoud : boolean;


    /**
     * P applies this parser and maps the result to a string.
     * This is done differently depending on what this parser returns.
     * For an array (usually of strings), the elements are concatenated and returned as a single string.
     * For a string, the string is returned.
     * For a quiet parser, an empty string is returned.
     * For a number, it is turned into a string.
     * For a symbol, its description text is returned.
     * For an object, its toString method is invoked.
     * For null or undefined, the strings "null" or "undefined" are returned.
     */
    readonly str : LoudParser<string>;
}
