/**
 * @module parjs
 */ /** */


import {Reply, ReplyKind} from "./reply";
import {UserState} from "./internal/state";
import {ImplicitLoudParser} from "./internal/literal-conversion";
import {ParjsCombinator} from "./index";

/**
 * A projection on the parser result and the parser state.
 */
export interface ParjsProjection<T, TOut> {
    (value: T, userState: UserState): TOut;
}

/**
 * A predicate on the parser result and the user state.
 */
export type ParjsPredicate<T> = ParjsProjection<T, boolean>;

/**
 * Interface for parsers that produce result values of type  {T}
 * @see {@link xQuietParser}
 *
 * @group functional
 */
export interface Parjser<T> {
    /**
     * Exposes the display name of the parser. Userful when debugging.
     *
     * @group informational
     */
    readonly type: string;

    /**
     * Applies `this` on the given input string.
     *
     * @param input The input string.
     * @param initialState An object containing properties that are merged with this parse invocation's user state.
     *
     * @group action
     */
    parse(input: string, initialState ?: UserState): Reply<T>;

    /**
     * Applies a combinator this parser, and returns the result. Identical to `cmb1(this)`.
     * @param cmb1 The combinator to apply.
     */
    pipe<T1>(
        cmb1: ParjsCombinator<T, T1>
    ): Parjser<T1>;

    pipe<T1, T2>(
        cmb1: ParjsCombinator<T, T1>,
        cmb2: ParjsCombinator<T1, T2>
    ): Parjser<T2>;

    pipe<T1, T2, T3>(
        cmb1: ParjsCombinator<T, T1>,
        cmb2: ParjsCombinator<T1, T2>,
        cmb3: ParjsCombinator<T2, T3>
    ): Parjser<T3>;

    pipe<T1, T2, T3, T4>(
        cmb1: ParjsCombinator<T, T1>,
        cmb2: ParjsCombinator<T1, T2>,
        cmb3: ParjsCombinator<T2, T3>,
        cmb4: ParjsCombinator<T3, T4>
    ): Parjser<T4>;

    pipe<T1, T2, T3, T4, T5>(
        cmb1: ParjsCombinator<T, T1>,
        cmb2: ParjsCombinator<T1, T2>,
        cmb3: ParjsCombinator<T2, T3>,
        cmb4: ParjsCombinator<T3, T4>,
        cmb5: ParjsCombinator<T4, T5>
    ): Parjser<T5>;

    pipe<T1, T2, T3, T4, T5, T6>(
        cmb1: ParjsCombinator<T, T1>,
        cmb2: ParjsCombinator<T1, T2>,
        cmb3: ParjsCombinator<T2, T3>,
        cmb4: ParjsCombinator<T3, T4>,
        cmb5: ParjsCombinator<T4, T5>,
        cmb6: ParjsCombinator<T5, T6>
    ): Parjser<T6>;

}
