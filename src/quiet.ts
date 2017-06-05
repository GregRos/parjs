/**
 * @module parjs
 */ /** */
import {AnyParser} from "./any";
import {ReplyKind, QuietReply} from "./reply";
import {LoudParser} from "./loud";

/**
 * A predicate over the user state, for parsers that don't produce results.
 * @see ParjsProjection
 */
export interface ParjsProjectionQuiet<T> {
    (userState : any) : T;
}
/**
 * A predicate over the user state, for parsers that don't produce results.
 * @see ParjsPredicate
 */
export type ParjsPredicateQuiet = ParjsProjectionQuiet<boolean>

/**
 * Interface for parsers that don't produce return values.
 * @see LoudParser
 */
export interface QuietParser extends AnyParser {
    /**
     * Applies {this} on the input, with the given initial state.
     * @param input The input string.
     * @param initialState The initial user state. The properties of this object are merged with those of the invocation's user state.
     */
    parse(input : string,initialState ?: any) : QuietReply;

    //+++ ALTERNATIVE

    /**
     * P will try to apply {this}. If it fails softly, it will try to apply each parser in {alt} until one succeeds.
     * P fails hard if any parser fails hard.
     * @param alt The alternative parsers.
     */
    or(...alt : QuietParser[]) : QuietParser;

    /**
     * P will try to apply {this}. If it fails hard, P will fail softly.
     */
    soft : QuietParser;

    /**
     * P will apply {this} and then call the given projection on the user state. P will then return the projection's result.
     * @param selector
     */
    map<T>(selector : ParjsProjectionQuiet<T>) : LoudParser<T>;


    /**
     * P will apply {this}, and then calls the specified function on the user state.
     * @param action The function to call.
     */
    act(action : ParjsProjectionQuiet<void>) : QuietParser;

    //+ Look Ahead

    /**
     * P will apply {this}. If it succeeds, it will backtrack to the original position in the input, effectively succeeding without consuming input.
     */
    readonly backtrack: QuietParser;

    /**
     * P will apply {this}. P will fail hard, or with the severity specified by {fail}, if {this} did not consume at least one character of the input.
     * @param fail The failure kind. Defaults to hard.
     */
    mustCapture(fail ?: ReplyKind.Fail) : QuietParser;

    /**
     * P will apply {this}, and then call the given predicate on the user state. If the predicate returns false, P will fail with the severity given by {fail}
     * @param condition The predicate.
     * @param fail The failure severity.
     */
    must(condition : ParjsPredicateQuiet, fail : ReplyKind.Fail) : QuietParser;
    /**
     * P will apply {this}, followed by {second}. If both succeed, P will return the result of {second}, if any.
     * P will fail soft if {this} fails softly, and it will fail hard otherwise (if {second} fails softly, or either parser fails hard).
     * @param second The parser to apply next.
     */
    then<TParser extends AnyParser>(second : TParser) : TParser;

    /**
     * P will apply {this}, and then each quiet or loud parser in {parsers} in sequence.
     * P will then return the results of all non-quiet parsers in an array.
     * P will softly if {this} fails softly, and will fail hard otherwise.
     * @param parsers
     */
    then<S>(...parsers : (LoudParser<S> | QuietParser)[]) : LoudParser<S[]>;

    /**
     * P will apply {this}, and then each quiet or loud parser in {quiet} in sequence.
     * P will fail softly if {this} fails softly, and will fail hard otherwise.
     * @param quiet A set of quiet parsers.
     */
    then(...quiet : QuietParser[]) : QuietParser;

    /**
     * P will apply {this} repeatedly, until it fails softly.
     * P will fail hard if {this} fails hard at any time.
     * @param minSuccess Optionally, the minimum number of times {this} must succeed. If specified, if {this} succeeds fewer times, P will fail hard.
     * @param maxIterations Optionally, the maximum number of times {this} will be applied.
     */
    many(minSuccess ?: number, maxIterations ?: number) : QuietParser;

    mixState(userState : any) : QuietParser;

    /**
     * P will apply {this} repeatedly, until {till} succeeds.
     *
     * In more detail: P will apply {this}. If it succeeds, it will immediatly apply {till}. If {till} fails softly, P repeats.
     * P fails hard if {this} or {till} fail hard.
     * If {this} fails before {till}, behavior is determined by the {tillOptional} parameter. By default, P will fail hard in this case too.
     * @param till The parser that tells P to stop repeating {this}.
     * @param tillOptional If true, P will stop applying {this} if it fails softly, thus behaving like the many() combinator.
     */
    manyTill(till : AnyParser, tillOptional ?: boolean) : QuietParser;
    /**
     * P will apply {this}. If it succeeds, it will pass the user state to the {till} predicate. If it returns false, then P repeats.
     *
     * This combinator behaves like the other version of manyTill, except that it applies a predicate instead of a parser.
     * @param till The predicate that determines whether iterating {this} should be stopped.
     * @param tillOptional Whether it's okay for {this} to fail softly before {till} returns false.
     */
    manyTill(till : ParjsPredicateQuiet, tillOptional ?: boolean) : QuietParser;

    /**
     * P will apply {this} and then {delimeter} repeatedly, until either fails softly.
     * If {this} fails softly after {delimeter} has succeeded, P will backtrack to before {delimeter} succeeded.
     * @param delimeter The delimeter parser.
     * @param max The maximum number of times {this} is applied.
     */
    manySepBy(delimeter : AnyParser, max ?: number) : QuietParser;

    /**
     * P will apply {this} exactly {count} times.
     * P will fail softly if {this} fails softly the 1st time, and it will fail hard if {this} fails softly afterwards.
     * @param count The number of times to apply {this}.
     */
    exactly(count : number) : QuietParser;
}
