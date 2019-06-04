/**
 * @module parjs
 */ /** */

import {AnyParser} from "./any";
import {Reply, ReplyKind} from "./reply";
import {QuietParser} from "./quiet";
import {UserState} from "./internal/implementation/state";
import {ImplicitAnyParser, ImplicitLoudParser} from "./convertible-literal";

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
 * The type `T[]` or a nested array type, such as `T[][][]`.
 */
export type NestedArray<T> = T | T[] | T[][] | T[][][] | T[][][][] | T[][][][][] | T[][][][][][] | T[][][][][][][][];

/**
 * Interface for parsers that produce result values of type  {T}
 * @see {@link xQuietParser}
 *
 * @group functional
 */
export interface LoudParser<T> extends AnyParser {

    /**
     * Applies `this` on the given input string.
     *
     * @param input The input string.
     * @param initialState An object containing properties that are merged with this parse invocation's user state.
     *
     * @group action
     */
    parse(input: string, initialState ?: UserState): Reply<T>;

    isLoud: true;

}
