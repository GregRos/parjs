/**
 * @module parjs
 */
/** */
import {AnyParser} from "./any";
import {QuietReply, ReplyKind} from "./reply";
import {LoudParser} from "./loud";
import {UserState} from "./internal/implementation/state";
import {ImplicitAnyParser, ImplicitLoudParser} from "./convertible-literal";

/**
 * A predicate over the user state, for parsers that don't produce results.
 * @see {@link ParjsProjection}
 */
export interface ParjsProjectionQuiet<T> {
    (userState: UserState): T;
}

/**
 * A predicate over the user state, for parsers that don't produce results.
 * @see {@link ParjsPredicate}
 */
export type ParjsPredicateQuiet = ParjsProjectionQuiet<boolean>;

/**
 * Interface for parsers that don't produce return values.
 * @see {@link LoudParser}
 *
 * @group functional
 */
export interface QuietParser extends AnyParser {
    isLoud: false;
    /**
     * Applies `this` on the input, with the given initial state.
     * @param input The input string.
     * @param initialState The initial user state. The properties of this object are merged with those of the invocation's user state.
     */
    parse(input: string, initialState ?: UserState): QuietReply;

}
