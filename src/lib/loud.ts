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
     * Returns a parser that will apply `this` and yield its result. It will convert hard failures by `this` to soft failures.
     *
     * @group combinator failure-recovery
     * @fail-type Always soft, unless `this` fails fatally
     */
    soft: LoudParser<T>;

    //+++ ALTERNATIVE
    /**
     * Returns a parser that will apply `this`. If it succeeds, the returned parser will backtrack to the original position in the input and yield the result, effectively succeeding without consuming input.
     *
     * @group combinator special backtracking
     * @fail-type As `this`
     */
    readonly backtrack: LoudParser<T>;

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
     * Returns a parser that will try to apply `this`. If `this` fails softly, the returned parser will apply `second`. The returned parser will yield the successful result.
     * @see {@link ParjsStatic.any}

     * @param second The alternative parser.
     *
     * @group combinator failure-recovery alternatives
     * @fail-type As subparsers
     */
    or<S>(second: ImplicitLoudParser<S>): LoudParser<T | S>;

    /**
     * Similar to other overloads. The returned parser will try two parsers after this one.
     * @see {@link ParjsStatic.any}

     * @param second The 2nd parser to try, after `this`.
     * @param third The 3rd parser to try, after the second one.
     *
     * @group combinator failure-recovery alternatives
     * @fail-type As subparsers
     */
    or<A, B>(second: ImplicitLoudParser<A>, third: ImplicitLoudParser<B>): LoudParser<T | A | B>;

    /**
     * Similar to the other overloads. The returned parser will try three parsers after this one.
     * @see {@link ParjsStatic.any}

     * @param second The 2nd parser to try.
     * @param third The 3rd parser to try
     * @param fourth The 4th parser to try
     *
     * @group combinator failure-recovery alternatives
     * @fail-type As subparsers
     */
    or<A, B, C>(second: ImplicitLoudParser<A>, third: ImplicitLoudParser<B>, fourth: ImplicitLoudParser<C>): LoudParser<T | A | B | C>;

    /**
     * Similar to other overloads. The returned parser will try four parsers after this one.
     * @see {@link ParjsStatic.any}
     * @param second The 2nd parser.
     * @param third The 3rd parser.
     * @param fourth The 4th parser.
     * @param fifth The 5th parser.
     *
     * @group combinator failure-recovery alternatives
     * @fail-type As subparsers
     */
    or<A, B, C, D>(second: ImplicitLoudParser<A>, third: ImplicitLoudParser<B>, fourth: ImplicitLoudParser<C>, fifth: ImplicitLoudParser<D>): LoudParser<T | A | B | C | D>;

    /**
     * The returned parser behaves like the other overloads, except that it will try a variable number of parsers specified in `parsers`.
     * @see {@link ParjsStatic.any}
     * @param parsers Zero or more parsers to try.
     *
     * @group combinator failure-recovery alternatives
     */
    or(...parsers: ImplicitLoudParser<any>[]): LoudParser<any>;

    //+ Look Ahead

    /**
     * Returns a parser that will apply `this` and yield its result. If `this` fails softly, the returned parser will succeed yield `val`.
     * @param val The value alternative.
     *
     * @group combinator failure-recovery alternatives
     * @fail-type Hard if `this` fails hard.
     */
    maybe<S>(val: S): LoudParser<T | S>;

    //+++MAPPING
    /**
     * Returns a parser that will apply `this`, call `projection` on its result, and yield the function's return value.
     * @param projection The function to apply to the result.
     *
     * @group combinator projection
     * @fail-type As `this`
     */
    map<S>(projection: ParjsProjection<T, S>): LoudParser<S>;

    /**
     * Returns a parser that will apply `this`, call `action` on the result, and yield the result of `this`.
     * @param action The action to call.
     *
     * @group combinator projection
     * @fail-type As `this`
     */
    each(action: ParjsProjection<T, void>): LoudParser<T>;

    /**
     * For TypeScript. This method returns `this`, statically typed as LoudParser{S}.
     * @group combinator projection
     * @fail-type As `this`
     */
    cast<S>(): LoudParser<S>;

    /**
     * Returns a parser that applies `this` and converts its result into a flattened array.
     * * If `this` yields a non-array `e`, returns `[e]`.
     * * Otherwise, will recursively merge all nested array elements into a single array.
     *
     * Can be used to flatten a sequence of `.then` combinators, which can create deeply nested array structures.

     * In TypeScript, the element type `T` is not always inferrred to be the best possible type. For example, `flatten` may return a parser of the type
     * `LoudParser{(T | T[])[]}`, where this method actually always returns `LoudParser<T[]>`.
     *
     * @group combinator projection
     * @example
     * let pArr = a.then(b).then(c).then(d).then(e); // pArr : LoudParser{[[[T, T], T], T], T]}, deeply nested array
     * let flat = pArr.flatten(); //flat : LoudParser{T[]}
     * @fail-type As `this`
     */
    flatten<T>(this: LoudParser<NestedArray<T>>): LoudParser<T[]>;

    /**
     * Can only be called on a parser that yields an array of objects.
     * Returns a parser that will merge all the objects returned by `this` and return the result.
     *
     * @group combinator projection
     * @fail-type As `this`
     */
    splat<O1>(this: LoudParser<[O1]>): LoudParser<O1>;

    splat<O1, O2>(this: LoudParser<[O1, O2]>): LoudParser<O1 & O2>;

    splat<O1, O2, O3>(this: LoudParser<[O1, O2, O3]>): LoudParser<O1 & O2 & O3>;

    splat<O1, O2, O3, O4>(this: LoudParser<[O1, O2, O3, O4]>): LoudParser<O1 & O2 & O3 & O4>;

    splat<O1, O2, O3, O4, O5>(this: LoudParser<[O1, O2, O3, O4, O5]>): LoudParser<O1 & O2 & O3 & O4 & O5>;

    splat<O1, O2, O3, O4, O5, O6>(this: LoudParser<[O1, O2, O3, O4, O5, O6]>): LoudParser<O1 & O2 & O3 & O4 & O5 & O6>;

    splat<O1, O2, O3, O4, O5, O6, O7>(this: LoudParser<[O1, O2, O3, O4, O5, O6, O7]>): LoudParser<O1 & O2 & O3 & O4 & O5 & O6 & O7>;

    splat<O1, O2, O3, O4, O5, O6, O7, O8>(this: LoudParser<[O1, O2, O3, O4, O5, O6, O7, O8]>): LoudParser<O1 & O2 & O3 & O4 & O5 & O6 & O7 & O8>;

    splat<O1, O2, O3, O4, O5, O6, O7, O8, O9>(this: LoudParser<[O1, O2, O3, O4, O5, O6, O7, O8, O9]>): LoudParser<O1 & O2 & O3 & O4 & O5 & O6 & O7 & O8 & O9>;

    //+++ RESTRICTIONS
    /**
     * Returns a parser that will apply `this` and yield its result. If it succeeds, the returned parser will apply a predicate to verify the result.
     * If the predicate returns false, the returned parser will fail hard, or else with the failure kind specified by `fail`.
     * @param condition The predicate.
     * @param name Optionally, the name of the condition the result must satisfy. For debugging or informational purposes.
     * @param fail Optionally, the failure type emitted. Defaults to hard.
     *
     * @group combinator assertion
     * @fail-type As `this`, or with `fail` (default Hard)
     */
    must(condition: ParjsPredicate<T>, name ?: string, fail ?: ReplyKind.Fail): LoudParser<T>;

    /**
     * Similar to {@link must}. Verifies that the result is non-empty, where an 'empty' object is any of: null, undefined, "", [], {}.
     * @see {@link must}
     * @param fail Optionally, the failure kind. Defaults to hard.
     *
     * @group combinator assertion
     * @fail-type As `this`, or with `fail` (default Hard)
     */
    mustBeNonEmpty(fail ?: ReplyKind.Fail): LoudParser<T>;

    /**
     * Similar to {@link must}. Verifies that the result is in `options`.
     * @param options The acceptable results.
     * @param fail Optionally, the failure kind. Defaults to hard.
     *
     * @group combinator assertion
     * @fail-type As `this`, or with `fail` (default Hard)
     * @see {@link must}
     */
    mustBeOf(options: T[], fail ?: ReplyKind.Fail): LoudParser<T>;

    /**
     * Similar to {@link must}. Verifies that the result is NOT in `options`.
     * @param options The prohibited results.
     * @param fail Optionally, the failure kind. Defaults to hard.
     *
     * @group combinator assertion
     * @fail-type As `this`, or with `fail`. Defaults to hard.
     * @see {@link must}
     */
    mustNotBeOf(options: T[], fail ?: ReplyKind.Fail): LoudParser<T>;

    /**
     * Similar to {@link must}. Verifies that `this` captured some of the input.
     *
     * @param kind The failure kind. Defaults to hard.
     *
     * @group combinator assertion
     * @fail-type As `this`, or with `fail` (default hard).
     * @see {@link must}
     */
    mustCapture(kind ?: ReplyKind.Fail): LoudParser<T>;

    /**
     * Returns a parser that will apply `this` between two other parsers, and yield only the result of `this`.
     * E.g.`x.between(a, b)` will apply parsers in the order: a, x, b; and yield the result of x.
     *
     * @param preceding The preceding parser.
     * @param proceeding The proceeding parser.
     *
     * @group combinator sequential
     * @fail-type See {@link ParjsStatic.seq}
     * @see {@link ParjsStatic.seq}

     */
    between(preceding: ImplicitAnyParser, proceeding: ImplicitAnyParser): LoudParser<T>;

    /**
     * Returns a parser that will apply `this` between two appearances of the given parser, and yield only the result of `this`.
     * E.g. x.between(y) will apply parsers in the order: y, x, y.
     * @param precedingAndPreceding The parser that surrounds `this`.
     *
     * @group combinator sequential
     * @fail-type See {@link ParjsStatic.seq}
     * @see {@link ParjsStatic.seq}
     */
    between(precedingAndPreceding: ImplicitAnyParser): LoudParser<T>;

    //+++SEQUENTIAL
    /**
     * Returns a parser that will apply `this`, and then immediately apply one or more following parsers.
     * It is similar to {@link ParjsStatic.seq}, but with a few differences.
     * * If only one parser is given, and it is quiet, then returned parser will yield the result of `this`.
     * * If only one loud parser is given, the returned parser will yield the result of `this` and the other parser in an array.
     * * If a mix of one or more quiet and loud parsers is given, will yield the results of all loud parsers in an array.
     *
     * @group combinator sequential
     * @fail-type See {@link ParjsStatic.seq}
     * @see {@link ParjsStatic.seq}
     */
    then(second ?: QuietParser): LoudParser<T>;

    then<S = T>(next: ImplicitLoudParser<S>): LoudParser<[T, S]>;

    then<S1 = T>(parsers: [ImplicitLoudParser<S1>]): LoudParser<[T, S1]>;

    then<S1 = T, S2 = S1>(parsers: [ImplicitLoudParser<S1>, ImplicitLoudParser<S2>]): LoudParser<[T, S1, S2]>;

    then<S1 = T, S2 = S1, S3 = S2>(parsers: [ImplicitLoudParser<S1>, ImplicitLoudParser<S2>, ImplicitLoudParser<S3>]): LoudParser<[T, S1, S2, S3]>;

    then(parsers: (QuietParser | ImplicitLoudParser<T>)[]): LoudParser<T[]>;

    /**
     * Returns a parser that will apply `this` exactly `count` times and yield the results of all applications in an array.
     * @param count The number of times to apply `this`.
     *
     * @group combinator sequential repetition
     * @fail-type Similarly to {@link ParjsStatic.seq}.
     */
    exactly(count: number): LoudParser<T[]>;

    /**
     * Returns a parser that will apply `this` repeatedly until it fails softly. The returned parser will yield all the results in an array.
     *
     * @param minSuccess Optionally, the minimum number of times `this` must succeed.
     * @param maxIterations Optionally, the maximum number of times `this` is applied. Defaults to Infinity.
     *
     * @group combinator sequential repetition
     * @fail-type Hard if `this` succeeds less than `minSuccess` times.
     */
    many(minSuccess ?: number, maxIterations ?: number): LoudParser<T[]>;

    /**
     * The returned parser will apply `this` followed by `till` repeatedly, until `till` succeeds. It will yield all the results yielded by `this` in an array.
     * If `this` fails softly, the `tillOptional` parameter determines behavior.
     *
     * @param till The parser that
     * @param tillOptional If true, the returned parser will stop applying `this` if it fails softly, thus behaving like the many() combinator.
     *
     * @group combinator sequential repetition
     * @fail-type Hard if `tillOptional` is false and `this` fails softly.
     */
    manyTill(till: ImplicitAnyParser, tillOptional ?: boolean): LoudParser<T[]>;

    /**
     * The returned parser will apply `this` and apply `till` on its result, until `till` returns true. It will yield all the results yielded by `this` in an array.
     *
     * If `this` fails softly, the `tillOptional` parameter determines behavior.
     * @param till The predicate that determines whether iterating `this` should be stopped.
     * @param tillOptional Whether it's okay for `this` to fail before `till` returns false.
     *
     * @group combinator sequential repetition
     * @fail-type Hard if `tillOptional` is false and `this` fails softly.
     */
    manyTill(till: ParjsPredicate<T>, tillOptional ?: boolean): LoudParser<T[]>

    /**
     * Returns a parser that will apply `this` and then `delimeter` repeatedly, until either fails softly. It returns all the results of `this`.
     * If `this` fails softly after `delimeter` has succeeded, the returned parser will backtrack to before `delimeter` succeeded.
     * @param delimeter The delimeter parser.
     * @param max Optionally, the maximum number of times `this` is applied.
     *
     * @group combinator sequential repetition
     * @fail-type Standard
     */
    manySepBy(delimeter: ImplicitAnyParser, max ?: number): LoudParser<T[]>;

    /**
     * Returns a parser that will apply `this`, and then call the selector function with the result of its result. The function returns another parser.
     * The returned parser will then apply that parser and return its result.
     * Because parser construction can be expensive, you can optionally provide a Map object which is used as a cache.
     * @param selector The function that selects which parser to apply next.
     * @group combinator sequential
     *
     * @fail-type As {@link ParjsStatic.seq}.
     */
    thenChoose<TParser extends ImplicitLoudParser<any>>(selector: (value: T, state: UserState) => TParser): TParser

    /**
     * Returns a parser that will apply `this`, and then call the selector function with the result of its result. The function returns another parser.
     * The returned parser will then apply that parser and return its result.
     * Because parser construction can be expensive, you can optionally provide a Map object which is used as a cache.
     * @param selector The function that selects which parser to apply next.
     * @group combinator sequential
     *
     * @fail-type As {@link ParjsStatic.seq}.
     */
    thenChoose<TParser extends QuietParser>(selector: (value: T, state: UserState) => TParser): TParser


}
