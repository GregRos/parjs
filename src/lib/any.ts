/**
 * @module parjs
 */ /** */
import {LoudParser} from "./loud";
import {AnyParserAction} from "./internal/action";
import {QuietParser} from "./quiet";
import {UserState} from "./internal/implementation/state";
/**
 * Common interface that unites parsers that produce values and ones that don't.
 * @see {@link LoudParser}
 * @see {@link QuietParser}
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
     * Returns a parser that will apply `this`. If `this` succeeds, the returned parser will discard its result (if any) and yield `result` instead.
     * @param result The value to yield.
     *
     * @group combinator projection optimizing
     * @fail-type As `this`.
     */
    result<S>(result : S) : LoudParser<S>;

    /**
     * Returns a parser that will apply `this`. The returned parser will yield nothing.
     *
     * @group combinator projection optimizing
     * @fail-type As `this`.
     */
    readonly q : QuietParser;

    /**
     * Returns a parser that will apply `this`, and will succeed if `this` fails hard or soft. If `this` succeeds instead, the returned parser will fail hard.
     *
     * @group combinator special
     * @fail-type As `this`.
     */
    readonly not : QuietParser;

    /**
     * Returns a parser that will apply `this`, and return the user state, discarding the result (if any).
     *
     * @group combinator projection
     * @fail-type As `this`.
     */
    readonly state : LoudParser<any>;

    /**
     * Whether the parser results in a value. Parsers cannot change their loudness.
     *
     * @group informational
     */
    readonly isLoud : boolean;

    /**
     * Returns a parser that will apply `this`, stringify its result, and yield it.
     * This is done differently depending on what `this` returns.
     * For an array (usually of strings), the elements are concatenated and returned as a single string.
     * For a string, the string is returned.
     * For a quiet parser, an empty string is returned.
     * For a number, it is turned into a string.
     * For a symbol, its description text is returned.
     * For an object, its toString method is invoked.
     * For null or undefined, the strings "null" or "undefined" are returned.
     *
     * @group combinator projection optimizing
     * @fail-type As `this`.
     */
    readonly str : LoudParser<string>;

	/**
	 * This method will wrap `this` in a state isolation construct.
	 * The returned parser will apply `this`, except that the current user state Fwill be replaced by a copy of `innerState`.
	 * When the returned parser finishes, the previous user state will be restored.
	 *
	 * Use this combinator to develop black-box parsers that utilize user state, without affecting or being affected by the user state of external parsers.
	 *
	 * @group combinator special
	 * @fail-type As `this`.
	 */
	isolateState(innerState ?: UserState) : this;

}
