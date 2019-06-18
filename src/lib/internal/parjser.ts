/**
 * @module parjs
 */ /** */


import {FailureInfo, ParjsResult} from "./result";
import {UserState} from "./state";
import {ImplicitParjser} from "./scalar-converter";

/**
 * A combinator or operator that takes a source parser that returns a new parser
 * based on it.
 */
export interface ParjsCombinator<TFrom, TTo> {
    (from: ImplicitParjser<TFrom>): Parjser<TTo>;
}

/**
 * A projection on the parser result and the parser state.
 */
export interface ParjsProjection<T, TOut> {
    (value: T, userState: UserState): TOut;
}

/**
 * A predicate on the parser result and the user state. This function must
 * return `true` if the input fulfills the predicate, or failure information
 * object if it does not. Returning things other than `true` will make it behave
 * like a failure.
 */
export type ParjsValidator<T> = ParjsProjection<T, Partial<FailureInfo> | true>;

/**
 * Interface for parsers that produce result values of type  {T}
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
    parse(input: string, initialState ?: UserState): ParjsResult<T>;

    /**
     * The chaining or piping operator. Applies a sequence of combinators to
     * this parser, feeding the result of one into the input of the next.
     * @param cmb1 The single combinator to apply.
     */
    pipe<T1>(
        cmb1: ParjsCombinator<T, T1>
    ): Parjser<T1>;

    /**
     * The chaining or piping operator. Applies a sequence of combinators to
     * this parser, feeding the result of one into the input of the next.
     * @param cmb1 The first combinator to apply.
     * @param cmb2 The second combinator to apply.
     */
    pipe<T1, T2>(
        cmb1: ParjsCombinator<T, T1>,
        cmb2: ParjsCombinator<T1, T2>
    ): Parjser<T2>;

    /**
     * The chaining or piping operator. Applies a sequence of combinators to
     * this parser, feeding the result of one into the input of the next.
     * @param cmb1 The first combinator to apply.
     * @param cmb2 The second combinator to apply.
     * @param cmb3 The third combinator to apply.
     */
    pipe<T1, T2, T3>(
        cmb1: ParjsCombinator<T, T1>,
        cmb2: ParjsCombinator<T1, T2>,
        cmb3: ParjsCombinator<T2, T3>
    ): Parjser<T3>;

    /**
     * The chaining or piping operator. Applies a sequence of combinators to
     * this parser, feeding the result of one into the input of the next.
     * @param cmb1 The first combinator to apply.
     * @param cmb2 The second combinator to apply.
     * @param cmb3 The third combinator to apply.
     * @param cmb4 The fourth combinator to apply.
     */
    pipe<T1, T2, T3, T4>(
        cmb1: ParjsCombinator<T, T1>,
        cmb2: ParjsCombinator<T1, T2>,
        cmb3: ParjsCombinator<T2, T3>,
        cmb4: ParjsCombinator<T3, T4>
    ): Parjser<T4>;

    /**
     * The chaining or piping operator. Applies a sequence of combinators to
     * this parser, feeding the result of one into the input of the next.
     * @param cmb1 The first combinator to apply.
     * @param cmb2 The second combinator to apply.
     * @param cmb3 The third combinator to apply.
     * @param cmb4 The fourth combinator to apply.
     * @param cmb5 The fifth combinator to apply.
     */
    pipe<T1, T2, T3, T4, T5>(
        cmb1: ParjsCombinator<T, T1>,
        cmb2: ParjsCombinator<T1, T2>,
        cmb3: ParjsCombinator<T2, T3>,
        cmb4: ParjsCombinator<T3, T4>,
        cmb5: ParjsCombinator<T4, T5>
    ): Parjser<T5>;

    /**
     * The chaining or piping operator. Applies a sequence of combinators to
     * this parser, feeding the result of one into the input of the next.
     * @param cmb1 The first combinator to apply.
     * @param cmb2 The second combinator to apply.
     * @param cmb3 The third combinator to apply.
     * @param cmb4 The fourth combinator to apply.
     * @param cmb5 The fifth combinator to apply.
     * @param cmb6 The sixth combinator to apply.
     */
    pipe<T1, T2, T3, T4, T5, T6>(
        cmb1: ParjsCombinator<T, T1>,
        cmb2: ParjsCombinator<T1, T2>,
        cmb3: ParjsCombinator<T2, T3>,
        cmb4: ParjsCombinator<T3, T4>,
        cmb5: ParjsCombinator<T4, T5>,
        cmb6: ParjsCombinator<T5, T6>
    ): Parjser<T6>;

}
