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
 *
 * @group functional
 */
export interface AnyParser {
    /**
     * Exposes the display name of the parser. Userful when debugging.
     *
     * @group informational
     */
    readonly displayName : string;
    /**
     * Exposes the internal parser action. This will generally contain the implementation of the parser instance.
     *
     * @group informational
     */
    readonly action : AnyParserAction;
    /**
     * P will apply {this}. If {this} succeeds, P will discard its result (if any) and return {result} instead.
     * @param result The value to return.
     *
     * @group combinator projection
     */
    result<S>(result : S) : LoudParser<S>;

    /**
     * P will apply {this}. If it succeeds, it will return nothing as a quiet parser.
     *
     * @group combinator projection
     */
    readonly q : QuietParser;

    /**
     * P will apply {this}. P will succeed if {this} fails hard or soft, and fail hard otherwise. P will still fail fatally if {this} fails fatally.
     *
     * @group combinator special
     */
    readonly not : QuietParser;

    /**
     * P will apply {this}, and return the user state, discarding the result (if any).
     *
     * @group combinator projection
     */
    readonly state : LoudParser<any>;

    /**
     * Whether the parser results in a value. Parsers cannot change their loudness.
     *
     * @group informational
     */
    readonly isLoud : boolean;

    /**
     * P will apply {this} and map the result to a string.
     * This is done differently depending on what {this} returns.
     * For an array (usually of strings), the elements are concatenated and returned as a single string.
     * For a string, the string is returned.
     * For a quiet parser, an empty string is returned.
     * For a number, it is turned into a string.
     * For a symbol, its description text is returned.
     * For an object, its toString method is invoked.
     * For null or undefined, the strings "null" or "undefined" are returned.
     *
     * @group combinator projection
     */
    readonly str : LoudParser<string>;
}
