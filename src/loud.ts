/**
 * @module parjs
 */ /** */

import {AnyParser} from "./any";
import {ReplyKind, Reply} from "./reply";
import {QuietParser} from "./quiet";

/**
 * A projection on the parser result and the parser state.
 */
export interface ParjsProjection<T, TOut> {
    (value : T, userState : any) : TOut;
}
/**
 * A predicate on the parser result and the user state.
 */
export type ParjsPredicate<T> = ParjsProjection<T, boolean>;


/**
 * Interface for parsers that produce result values of type  {T}
 * @see QuietParser
 */
export interface LoudParser<T> extends AnyParser {
    /**
     * Applies this parser on the specified input string.
     * @param input The input string.
     * @param initialState An object containing properties that are merged with this parse invocation's user state.
     */
    parse(input : string, initialState ?: object) : Reply<T>;

    //+++ ALTERNATIVE

    /**
     * P tries to apply this parser. If it fails, then it tries to apply `alt` instead.
     * The return depends on which parser succeeded.
     * @param alt The loud parser alternatie.
     */
    or<S>(alt : LoudParser<S>) : LoudParser<T | S>;

    or<A, B>(a : LoudParser<A>, b : LoudParser<B>) : LoudParser<T | A | B>;

    or<A, B, C>(a : LoudParser<A>, b : LoudParser<B>, c : LoudParser<C>) : LoudParser<T | A | B| C>;

    or<A, B, C, D>(a : LoudParser<A>, b : LoudParser<B>, c : LoudParser<C>, d : LoudParser<D>) : LoudParser<T | A | B| C | D>;

    soft : LoudParser<T>;

    /**
     * Applies this parser. If it fails, P succeeds without consuming input and returns the given value.
     * @param val The value alternative.
     */
    orVal<S>(val : S) : LoudParser<T | S>;

    /**
     * P tries to apply this parser. If it fails, then tries to apply the `parsers` one after the other until one of them succeeds.
     * @param parsers The parsers to try.
     */
    or(...parsers : LoudParser<any>[]) : LoudParser<any>;



    //+ Look Ahead

    /**
     * P applies this parser. If it succeeds, it backtracks to the original position in the input, effectively succeeding without consuming input.
     */
    readonly backtrack : LoudParser<T>;

    //+++MAPPING
    /**
     *P Applies this parser, and then applies the given function on the result.
     * @param mapping The function to apply to the result.
     */
    map<S>(mapping : ParjsProjection<T, S>) : LoudParser<S>;

    /**
     * P applies this parser, and then calls the specified function on the result.
     * Returns the result of P.
     * @param action The action to call.
     */
    act(action : ParjsProjection<T, void>) : LoudParser<T>;

    /**
     * P returns this parser, statically typed as LoudParser{T}.
     * Only makes sense in TypeScript.
     */
    cast<S>() : LoudParser<S>;

    mixState(userState : any) : LoudParser<T>;

	readonly maybe : LoudParser<T>;


    //+++ RESTRICTIONS
    /**
     * P applies this parser, and further requires that the result fulfill a condition.
     * If the condition is not fulfilled, the parser fails.
     * @param condition The condition. The 2nd parameter is the user state.
     * @param name The name of the condition the result must satisfy.
     * @param fail The failure type emitted.
     */
    must(condition : ParjsPredicate<T>, name ?: string, fail ?: ReplyKind.Fail) : LoudParser<T>;

    /**
     * P applies this parser and verifies its result is non-empty.
     * An empty result is any of the following: null, undefined, "", [], {}. It is NOT the same as falsy.
     */
        readonly mustBeNonEmpty : LoudParser<T>;

    /**
     * P applies this parser and requires its result to be identical to {options}.
     * @param options The possible results.
     */
    mustBeOf(...options : T[]) : LoudParser<T>;

    /**
     * P applies this parser and requires its result not to be identical to any of {options}.
     * @param options The prohibited results.
     */
    mustNotBeOf(...options : T[]) : LoudParser<T>;

    /**
     * P applies this parser, and requires that it consume at least one character of the input.
     */
    mustCapture(kind ?: ReplyKind.Fail) : LoudParser<T>;

    /**
     * P sandwiches this parser between two other parsers. Returns the result of this parser.
     * @param preceding The preceding parser.
     * @param proceeding The proceeding parser.
     */
    between(preceding : AnyParser, proceeding : AnyParser) : LoudParser<T>;

    /**
     * P applies sandwiches this parser between two instances of the same parser. Returns the result of this parser.
     * @param precedingAndPreceding The parser this parser is sandwiched between.
     */
    between(precedingAndPreceding : AnyParser) : LoudParser<T>;

    //+++SEQUENTIAL
    /**
     * P applies this parser and then immediately another (quiet) parser and returns the result of this parser.
     * @param quiet The quiet parser to follow this one.
     */
    then(quiet : QuietParser) : LoudParser<T>;

    /**
     * Applies this parser and then immediately another (loud) parser, returning the results of both in a tuple if it succeeds.
     * @param loud The loud parser to follow this one.
     */
    then<S>(loud : LoudParser<S>) : LoudParser<[T, S]>;


    /**
     * P applies this parser and then immediately a sequence of parsers, each either quiet or loud returning T.
     * Returns an array containing all the returned values.
     * @param quietOrLoud The series of quiet or loud parsers.
     */
    then(...quietOrLoud : (LoudParser<T> | QuietParser)[]) : LoudParser<T[]>;

    /**
     * P applies this parser, and them immediately a sequence of quiet parsers.
     * Returns the result of this parser.
     * @param quiet The sequence of quiet parsers.
     */
    then(...quiet : QuietParser[]) : LoudParser<T>;

    /**
     * An advanced combinator.
     * P applies this parser, and then calls the selector function with this parser's return value to determine the parser to apply next.
     * Because parser construction can be expensive, you can optionally provide a Map object which is used as a cache.
     * @param selector The function that selects which parser to apply next.
     * @param cache An optional cache object.
     */
    thenChoose<TParser extends LoudParser<any>>(selector : (value : T) => TParser, cache ?: Map<T, AnyParser>) : TParser

    /**
     * P applies this parser exactly {count} times and returns an array of the results.
     * @param count The number of times to apply this parser.
     */
    exactly(count : number) : LoudParser<T[]>;

    /**
     * Applies this parser repeatedly until it fails, returning the results in an array.
     * @param minSuccess The minimum number of times this parser is applied.
     * @param maxIterations The maximum number of times this parser is applied.
     */
    many(minSuccess ?: number, maxIterations ?: number) : LoudParser<T[]>;

    /**
     * P applies this parser repeatedly until the `till` parser succeeds, returning an array of all results.
     * P fails if this parser fails before the `till` parser does.
     * @param till The parser
     * @param tillOptional Whether or not the `till` parser is optional. I.e. without this, P will behave similarly to a many
     * parser too, terminating once this parser fails.
     */
    manyTill(till : AnyParser, tillOptional ?: boolean) : LoudParser<T[]>;

    manyTill(till : ParjsPredicate<T>, tillOptional ?: boolean) : LoudParser<T[]>

    /**
     * P applies this parser repeatedly, every two occurrences separated by the delimeter parser.
     * P succeeds even when delimeter succeeds but this parser fails. In that case, however, input is not consumed by {delimeter}.
     * @param delimeter The delimeter parser.
     * @param max The maximum number of times this parser is applied.
     */
    manySepBy(delimeter : AnyParser, max ?: number) : LoudParser<T[]>;
}
