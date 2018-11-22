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
export type ParjsPredicateQuiet = ParjsProjectionQuiet<boolean>

/**
 * Interface for parsers that don't produce return values.
 * @see {@link LoudParser}
 *
 * @group functional
 */
export interface QuietParser extends AnyParser {
    /**
     * The returned parser will try to apply `this`. If it fails hard, the returned parser will fail softly, letting you use alternatives.
     *
     * @group combinator failure-recovery
     * @fail-type Usually won't, unless `this` fails fatally.
     */
    soft: QuietParser;

    //+++ ALTERNATIVE
    /**
     * The returned parser will apply `this`. If `this` succeeds, the returned parser will backtrack to the original position in the input, effectively succeeding without consuming input.
     *
     * @group combinator special backtrack
     * @fail-type As `this`.
     */
    readonly backtrack: QuietParser;

    /**
     * Applies `this` on the input, with the given initial state.
     * @param input The input string.
     * @param initialState The initial user state. The properties of this object are merged with those of the invocation's user state.
     */
    parse(input: string, initialState ?: UserState): QuietReply;

    /**
     * The returned parser will try to apply `this`. If `this` fails softly, it will try to apply each parser in `alt` until one succeeds.
     * @param alt The alternative parsers.
     *
     * @group combinator failure-recovery alternatives
     * @fail-type See {@link LoudParser.or}
     */
    or(...alt: QuietParser[]): QuietParser;

    /**
     * The returned parser will apply `this` and then call the given projection on the user state. The returned parser will then return the projection's result.
     * @param projection A projection that takes the user state and returns a value.
     *
     * @group combinator projection
     * @fail-type As `this`
     */
    map<T>(projection: ParjsProjectionQuiet<T>): LoudParser<T>;

    //+ Look Ahead

    /**
     * The returned parser will apply `this`, and then call the specified function on the user state.
     * @param action The function to call.
     *
     * @group combinator projection
     * @fail-type As `this`
     */
    each(action: ParjsProjectionQuiet<void>): QuietParser;

    /**
     * The returned parser will apply `this`. If `this` succeeds without consuming input, the returned parser will fail hard or with the severity given in `fail`.
     * @param fail The failure kind. Defaults to hard.
     * @group combinator assertion
     *
     * @fail-type As `this`, or with `fail` (default hard)
     */
    mustCapture(fail ?: ReplyKind.Fail): QuietParser;

    /**
     * The returned parser will apply `this`, and then call the given predicate on the user state. If the predicate returns false,
     * the returned parser will fail hard or with the severity given by `fail`.
     * @param condition The predicate.
     * @param fail The failure severity.
     *
     * @group combinator assertion
     * @fail-type As `this, or with `fail`.
     */
    must(condition: ParjsPredicateQuiet, fail ?: ReplyKind.Fail): QuietParser;

    /**
     * Returns a parser that will apply `this`, and then immediately apply one or more following parsers.
     * It is similar to {@link ParjsStatic.seq}, but with a few differences.
     * * If only one parser is given, and it is quiet, then returned parser will also be quiet.
     * * If only one loud parser is given, the returned parser will yield the same value as that parser.
     * * If a mix of one or more quiet and loud parsers is given, will yield the results of all loud parsers in an array.
     * @group combinator sequential
     * @fail-type See {@link ParjsStatic.seq}
     * @see {@link ParjsStatic.seq}
     */
    then(second ?: QuietParser): QuietParser;

    then<T>(next: ImplicitLoudParser<T>): LoudParser<T>;

    then<T>(parsers: [ImplicitLoudParser<T>]): LoudParser<[T]>;

    then<T1, T2>(parsers: [ImplicitLoudParser<T1>, ImplicitLoudParser<T2>]): LoudParser<[T1, T2]>;

    then<T1, T2, T3>(parsers: [ImplicitLoudParser<T1>, ImplicitLoudParser<T2>, ImplicitLoudParser<T3>]): LoudParser<[T1, T2, T3]>;

    then<S = undefined>(parsers: (QuietParser | ImplicitLoudParser<S>)[]): LoudParser<S[]>;


    /**
     * Returns a parser that will apply `this` repeatedly until it fails softly.
     *
     * @param minSuccess Optionally, the minimum number of times `this` must succeed.
     * @param maxIterations Optionally, the maximum number of times `this` is applied. Defaults to Infinity.
     *
     * @group combinator sequential repetition
     * @fail-type Hard if `this` succeeds less than `minSuccess` times.
     */
    many(minSuccess ?: number, maxIterations ?: number): QuietParser;

    /**
     * The returned parser will apply `this` followed by `till` repeatedly, until `till` succeeds.
     * If `this` fails softly, the `tillOptional` parameter determines behavior.
     *
     * @param till The parser that
     * @param tillOptional If true, the returned parser will stop applying `this` if it fails softly, thus behaving like the many() combinator.
     *
     * @group combinator sequential repetition
     * @fail-type Hard if `tillOptional` is false and `this` fails softly.
     */
    manyTill(till: ImplicitAnyParser, tillOptional ?: boolean): QuietParser;

    /**
     * The returned parser will repeatedly apply `this` and apply `till` on its result, until `till` returns true.
     *
     * If `this` fails softly, the `tillOptional` parameter determines behavior.
     * @param till The predicate that determines whether iterating `this` should be stopped.
     * @param tillOptional Whether it's okay for `this` to fail before `till` returns false.
     *
     * @group combinator sequential repetition
     * @fail-type Hard if `tillOptional` is false and `this` fails softly.
     */
    manyTill(till: ParjsPredicateQuiet, tillOptional ?: boolean): QuietParser;

    /**
     * Returns a parser that will apply `this` and then `delimeter` repeatedly, until either fails softly.
     * If `this` fails softly after `delimeter` has succeeded, the returned parser will backtrack to before `delimeter` succeeded.
     * @param delimeter The delimeter parser.
     * @param max Optionally, the maximum number of times `this` is applied.
     *
     * @group combinator sequential repetition
     */
    manySepBy(delimeter: ImplicitAnyParser, max ?: number): QuietParser;

    /**
     * Returns a parser that will apply `this` exactly `count` times and yield the results of all applications in an array.
     * @param count The number of times to apply `this`.
     *
     * @group combinator sequential repetition
     * @fail-type Similarly to {@link ParjsStatic.seq}.
     */
    exactly(count: number): QuietParser;

    /**
     * The returned parser will apply `this` at the current position, and will succeed if `this` succeeds or fails softly.
     * i.e. it will make `this` an optional parser.
     */
    maybe(): QuietParser;
}
