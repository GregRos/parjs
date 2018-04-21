/**
 * @module parjs
 */ /** */

import {AnyParser} from "./any";
import {ReplyKind, Reply} from "./reply";
import {QuietParser} from "./quiet";
import {UserState} from "./internal/implementation/state";
import {ImplicitAnyParser, ImplicitLoudParser} from "./convertible-literal";

/**
 * A projection on the parser result and the parser state.
 */
export interface ParjsProjection<T, TOut> {
    (value : T, userState : UserState) : TOut;
}
/**
 * A predicate on the parser result and the user state.
 */
export type ParjsPredicate<T> = ParjsProjection<T, boolean>;

/**
 * The type `T[]` or a nested array type, such as `T[][][]`.
 */
export type NestedArray<T> = T | T[] | T[][] | T[][][] | T[][][][] | T[][][][][] | T[][][][][][] | T[][][][][][][][];

/** @private*/ export declare function flatten<T>(this : LoudParser<NestedArray<T>>) : LoudParser<T[]>;

/** @private*/ export declare function splat<O1>(this : LoudParser<[O1]>) : LoudParser<O1>;

/** @private*/ export declare function splat<O1, O2>(this : LoudParser<[O1, O2]>) : LoudParser<O1 & O2>;

/** @private*/ export declare function splat<O1, O2, O3>(this : LoudParser<[O1, O2, O3]>) : LoudParser<O1 & O2 & O3>;

/** @private*/ export declare function splat<O1, O2, O3, O4>(this : LoudParser<[O1, O2, O3, O4]>) : LoudParser<O1 & O2 & O3 & O4>;

/** @private*/ export declare function splat<O1, O2, O3, O4, O5>(this : LoudParser<[O1, O2, O3, O4, O5]>) : LoudParser<O1 & O2 & O3 & O4 & O5>;
/** @private*/ export declare function splat<O1, O2, O3, O4, O5, O6>(this : LoudParser<[O1, O2, O3, O4, O5, O6]>) : LoudParser<O1 & O2 & O3 & O4 & O5 & O6>;
/** @private*/ export declare function splat<O1, O2, O3, O4, O5, O6, O7>(this : LoudParser<[O1, O2, O3, O4, O5, O6, O7]>) : LoudParser<O1 & O2 & O3 & O4 & O5 & O6 & O7>;
/** @private*/ export declare function splat<O1, O2, O3, O4, O5, O6, O7, O8>(this : LoudParser<[O1, O2, O3, O4, O5, O6, O7, O8]>) : LoudParser<O1 & O2 & O3 & O4 & O5 & O6 & O7 & O8>;
/** @private*/ export declare function splat<O1, O2, O3, O4, O5, O6, O7, O8, O9>(this : LoudParser<[O1, O2, O3, O4, O5, O6, O7, O8, O9]>) : LoudParser<O1 & O2 & O3 & O4 & O5 & O6 & O7 & O8 & O9>;

/**
 * Interface for parsers that produce result values of type  {T}
 * @see QuietParser
 *
 * @group functional
 */
export interface LoudParser<T> extends AnyParser {
    /**
     * Applies `this` on the given input string.
     * @param input The input string.
     * @param initialState An object containing properties that are merged with this parse invocation's user state.
     *
     * @group action
     */
    parse(input : string, initialState ?: UserState) : Reply<T>;

    //+++ ALTERNATIVE

    /**
     * Returns a parser that will try to apply `this`. If `this` fails softly, the returned parser will apply `second`. The returned parser will yield the successful result.
     * @param second The alternative parser.
     * @group combinator failure-recovery alternatives
     */
    or<S>(second : ImplicitLoudParser<S>) : LoudParser<T | S>;
    /**
     * Similar to other overloads. The returned parser will try two parsers after this one.
     * @param second The 2nd parser to try, after `this`.
     * @param third The 3rd parser to try, after the second one.
     * @group combinator failure-recovery alternatives
     */
    or<A, B>(second : ImplicitLoudParser<A>, third : ImplicitLoudParser<B>) : LoudParser<T | A | B>;

    /**
     * Similar to the other overloads. The returned parser will try three parsers after this one.
     * @param second The 2nd parser to try.
     * @param third The 3rd parser to try
     * @param fourth The 4th parser to try
     * @group combinator failure-recovery alternatives
     */
    or<A, B, C>(second : ImplicitLoudParser<A>, third : ImplicitLoudParser<B>, fourth : ImplicitLoudParser<C>) : LoudParser<T | A | B| C>;

    /**
     * Similar to other overloads. The returned parser will try four parsers after this one.
     * @param second The 2nd parser.
     * @param third The 3rd parser.
     * @param fourth The 4th parser.
     * @param fifth The 5th parser.
     * @group combinator failure-recovery alternatives
     */
    or<A, B, C, D>(second : ImplicitLoudParser<A>, third : ImplicitLoudParser<B>, fourth : ImplicitLoudParser<C>, fifth : ImplicitLoudParser<D>) : LoudParser<T | A | B| C | D>;

    /**
     * The returned parser behaves like the other overloads, except that it will try a variable number of parsers specified in `parsers`.
     * @param parsers Zero or more parsers to try.
     * @group combinator failure-recovery alternatives
     */
    or(...parsers : ImplicitLoudParser<any>[]) : LoudParser<any>;

    /**
     * Returns a parser that will apply `this` and yield its result. If `this` fails hard or soft, the returned parser will fail softly.
     * In other words, the returned parser will convert hard failures into soft ones.
     * @group combinator failure-recovery
     */
    soft : LoudParser<T>;

    /**
     * Returns a parser that will apply `this` and yield its result. If `this` fails softly, the returned parser will succeed yield `val`.
     * @param val The value alternative.
     * @group combinator failure-recovery alternatives
     */
    maybe<S>(val : S) : LoudParser<T | S>;

    //+ Look Ahead

    /**
     * Returns a parser that will apply `this`. If it succeeds, the returned parser will backtrack to the original position in the input and yield the result, effectively succeeding without consuming input.
     * @group combinator special backtracking
     */
    readonly backtrack : LoudParser<T>;

    //+++MAPPING
    /**
     * Returns a parser that will apply `this`, call `projection` on its result, and yield the function's return value.
     * @param projection The function to apply to the result.
     * @group combinator projection
     */
    map<S>(projection : ParjsProjection<T, S>) : LoudParser<S>;

    /**
     * Returns a parser that will apply `this`, call `action` on the result, and yield the result of `this`.
     * @param action The action to call.
     * @group combinator projection
     */
    each(action : ParjsProjection<T, void>) : LoudParser<T>;

    /**
     * For TypeScript. This method returns `this`, statically typed as LoudParser{S}.
     * @group combinator projection
     */
    cast<S>() : LoudParser<S>;

    /**
     * Returns a parser that applies `this` and flattens its result into an array.
     * If `this` yields a non-array `e`, returns `[e]`.
     * Otherwise, if `this` yields an array containing a mix of (nested?) array elements and regular elements, will merge all of these into a single array.
     *
     * In TypeScript, the element type `T` is not always inferrred to be the best possible type. For example, `flatten` may return a parser of the type
     * `LoudParser{(T | T[])[]}`, where this method actually always returns `LoudParser<T[]>`.
     *
     * Can be used to flatten a sequence of `.then` combinators, which can create deeply nested array structures.
     * @group combinator projection
     * @example
     * let pArr = a.then(b).then(c).then(d).then(e); // pArr : LoudParser{[[[T, T], T], T], T]}, deeply nested array
     * let flat = pArr.flatten(); //flat : LoudParser{T[]}
     */
    readonly flatten : typeof flatten;

    /**
     * Can only be called if `this` yields an array of objects.
     * Returns a parser that will apply `this` and yield its results as a single object, by merging the properties of each object in the returned array.
     *
     * @group combinator projection
     */
    readonly splat : typeof splat;

    //+++ RESTRICTIONS
    /**
     * Returns a parser that will apply `this` and yield its result. If it succeeds, the returned parser will apply a predicate to verify the result.
     * If the predicate returns false, the returned parser will fail hard, or else with the failure kind specified by `fail`.
     * @param condition The predicate.
     * @param name Optionally, the name of the condition the result must satisfy. For debugging or informational purposes.
     * @param fail Optionally, the failure type emitted. Defaults to hard.
     * @group combinator assertion
     */
    must(condition : ParjsPredicate<T>, name ?: string, fail ?: ReplyKind.Fail) : LoudParser<T>;

    /**
     * Returns a parser that will apply `this` and yield its result. If it succeeds, the returned parser will check the result is not "empty", where an empty result means one of the following: null, undefined, "", [], {}.
     * If the result is empty, the returned parser will fail hard or according to the severity specified by `fail`.
     * @param fail Optionally, the failure kind. Defaults to hard.
     * @group combinator assertion
     */
    mustBeNonEmpty(fail ?: ReplyKind.Fail) : LoudParser<T>;

    /**
     * Returns a parser that will apply `this` and yield its result. If it succeeds, the returned parser will check the result is in `options`.
     * If it's not, the returned parser will fail hard or with the severity specified by `fail`.
     * @param options The acceptable results.
     * @param fail Optionally, the failure kind. Defaults to hard.
     * @group combinator assertion
     */
    mustBeOf(options : T[], fail ?: ReplyKind.Fail) : LoudParser<T>;

    /**
     * Returns a parser that will apply `this` and yield its result. If it succeeds, the returned parser will check the result is not in `options`.
     * Otherwise, the returned parser will fail hard or with the severity specified by `fail`.
     * @param options The prohibited results.
     * @param fail Optionally, the failure kind. Defaults to hard.
     * @group combinator assertion
     */
    mustNotBeOf(options : T[], fail ?: ReplyKind.Fail) : LoudParser<T>;

    /**
     * Returns a parser parser that will apply `this` and yield its result. If it succeeds, the returned parser will check `this` consumed at least one character of the input.
     * Otherwise, the returned parser will fail hard or according to the severity specified by `fail`.
     * @param kind The failure kind. Defaults to hard.
     * @group combinator assertion
     */
    mustCapture(kind ?: ReplyKind.Fail) : LoudParser<T>;

    /**
     * Returns a parser that will apply `this` between two other parsers, and yield only the result of `this`.
     * E.g.`x.between(a, b)` will apply parsers in the order: a, x, b; and yield the result of x.
     * @param preceding The preceding parser.
     * @param proceeding The proceeding parser.
     * @group combinator sequential
     */
    between(preceding : ImplicitAnyParser, proceeding : ImplicitAnyParser) : LoudParser<T>;

    /**
     * Returns a parser that will apply `this` between two appearances of the given parser, and yield only the result of `this`.
     * E.g. x.between(y) will apply parsers in the order: y, x, y.
     * @param precedingAndPreceding The parser that surrounds `this`.
     * @group combinator sequential
     */
    between(precedingAndPreceding : ImplicitAnyParser) : LoudParser<T>;

    //+++SEQUENTIAL
    /**
     * The `then` methods return a parser that will apply additional parsers immediately after this one.
     * If a parser is given and it is quiet, the returned parser will yield the value of this parser.
     * If the given parser is loud, the returned parser will yield the values of this parser and the given parser in an array.
     * If an array of loud and quiet parsers is given, the returned parser will yield the results of all loud parsers in an array.
     *
     * @group combinator sequential
     */
    then(second ?: QuietParser) : LoudParser<T>;
    then<S = T>(next : ImplicitLoudParser<S>) : LoudParser<[T, S]>;
    then<S1 = T>(parsers : [ImplicitLoudParser<S1>]) : LoudParser<[T, S1]>;
    then<S1 = T, S2 = S1>(parsers : [ImplicitLoudParser<S1>, ImplicitLoudParser<S2>]) : LoudParser<[T, S1, S2]>;
    then<S1 = T, S2 = S2, S3 = S3>(parsers : [ImplicitLoudParser<S1>, ImplicitLoudParser<S2>, ImplicitLoudParser<S3>]) : LoudParser<[T, S1, S2, S3]>;
    then(parsers : (QuietParser | ImplicitLoudParser<T>)[]) : LoudParser<T[]>;

    /**
     * Returns a parser that will apply `this` exactly `count` times and yield the results of all applications in an array.
     * @param count The number of times to apply `this`.
     * @group combinator sequential repetition
     */
    exactly(count : number) : LoudParser<T[]>;

    /**
     * Retursns a parser that will apply `this` repeatedly until it fails softly. The returned parser will yield all the results in an array.
     * @param minSuccess Optionally, the minimum number of times `this` must succeed.
     * @param maxIterations Optionally, the maximum number of times `this` is applied. Defaults to Infinity.
     * @group combinator sequential repetition
     */
    many(minSuccess ?: number, maxIterations ?: number) : LoudParser<T[]>;

    /**
     * The returned parser will apply `this` followed by `till` repeatedly, until `till` succeeds. It will yield all the results yielded by `this` in an array.
     * If `this` fails softly, the `tillOptional` parameter determines behavior.
     * @param till The parser that
     * @param tillOptional If true, the returned parser will stop applying `this` if it fails softly, thus behaving like the many() combinator.
     * @group combinator sequential repetition
     */
    manyTill(till : ImplicitAnyParser, tillOptional ?: boolean) : LoudParser<T[]>;

    /**
     * The returned parser will apply `this` and apply `till` on its result, until `till` returns true. It will yield all the results yielded by `this` in an array.
     * 
     * If `this` fails softly, the `tillOptional` parameter determines behavior.
     * @param till The predicate that determines whether iterating `this` should be stopped.
     * @param tillOptional Whether it's okay for `this` to fail before `till` returns false.
     * @group combinator sequential repetition
     */
    manyTill(till : ParjsPredicate<T>, tillOptional ?: boolean) : LoudParser<T[]>

    /**
     * Returns a parser that will apply `this` and then `delimeter` repeatedly, until either fails softly. It returns all the results of `this`.
     * If `this` fails softly after `delimeter` has succeeded, the returned parser will backtrack to before `delimeter` succeeded.
     * @param delimeter The delimeter parser.
     * @param max Optionally, the maximum number of times `this` is applied.
     *
     * @group combinator sequential repetition
     */
    manySepBy(delimeter : ImplicitAnyParser, max ?: number) : LoudParser<T[]>;

    /**
     * Returns a parser that will apply `this`, and then call the selector function with the result of its result. The function returns another parser.
     * The returned parser will then apply that parser and return its result.
     * Because parser construction can be expensive, you can optionally provide a Map object which is used as a cache.
     * @param selector The function that selects which parser to apply next.
     * @group combinator sequential
     */
    thenChoose<TParser extends ImplicitLoudParser<any>>(selector : (value : T, state : UserState) => TParser) : TParser

    /**
     * Returns a parser that will apply `this`, and then call the selector function with the result of its result. The function returns another parser.
     * The returned parser will then apply that parser and return its result.
     * Because parser construction can be expensive, you can optionally provide a Map object which is used as a cache.
     * @param selector The function that selects which parser to apply next.
     * @group combinator sequential
     */
    thenChoose<TParser extends QuietParser>(selector : (value : T, state : UserState) => TParser) : TParser

    /**
     * P will wrap {this} in a nested parser construct.
     * It will apply {this} with an isolated parser state equal to the initial state. It will then return the value of {this}.
     * However, the isolated parser state of {this} will be lost, so you must extract any information through the return value.
     *
     * @group combinator special
     */
    readonly isolate;


}
