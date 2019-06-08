/**
 * @module parjs
 */ /** */


import {Reply, ReplyKind} from "./reply";
import {UserState} from "./internal/implementation/state";
import {ImplicitLoudParser} from "./convertible-literal";

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
export interface LoudParser<T> {
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



    pipe<T1>(
        t1: (a: this) => T1
    ): T1;

    pipe<T1, T2>(
        t1: (a: this) => T1,
        t2: (a: T1) => T2
    ): T2;

    pipe<T1, T2, T3>(
        t1: (a: this) => T1,
        t2: (a: T1) => T2,
        t3: (a: T2) => T3
    ): T3;

    pipe<T1, T2, T3, T4>(
        t1: (a: this) => T1,
        t2: (a: T1) => T2,
        t3: (a: T2) => T3,
        t4: (a: T3) => T4
    ): T4;

}
