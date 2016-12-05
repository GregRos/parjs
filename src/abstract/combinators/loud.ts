


interface ValueResult<T> {
    hasResult : true;
    result : T;
    state : any;
}

interface NoValueResult {
    hasResult : false;
    state : any;
}

interface LoudParser<T> extends AnyParser {

}

/**
 * Created by User on 21-Nov-16.
 */
interface LoudParser<T> extends AnyParser {
    //+++ ALTERNATIVE

    /**
     * P tries to apply this parser. If it fails, then it tries to apply `alt` instead.
     * The return depends on which parser succeeded.
     * @param alt The loud parser alternatie.
     */
    or<S>(alt : LoudParser<S>) : LoudParser<T | S>;

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
}

/**
 * Created by User on 21-Nov-16.
 */
interface LoudParser<T> {
    //+ Look Ahead

    /**
     * P applies this parser. If it succeeds, it backtracks to the original position in the input, effectively succeeding without consuming input.
     */
    readonly backtrack : LoudParser<T>;
}
interface LoudParser<T> {
    //+++MAPPING
    /**
     *P Applies this parser, and then applies the given function on the result.
     * @param mapping The function to apply to the result.
     */
    map<S>(mapping : (result : T) => S) : LoudParser<S>;

    /**
     * P returns this parser, statically typed as LoudParser<S>.
     * Only makes sense in TypeScript.
     */
    cast<S>() : LoudParser<S>;

    /**
     * P applies this parser and maps the result to a string.
     * This is done differently depending on what this parser returns.
     * For an array (usually of strings), the elements are concatenated and returned as a single string.
     * For a number, it is turned into a string.
     * For a symbol, its description text is returned.
     * For an object, its toString method is invoked.
     */
    readonly str : LoudParser<string>;
}

interface LoudParser<T> {
    //+++ RESTRICTIONS
    /**
     * P applies this parser, and further requires that the result fulfill a condition.
     * If the condition is not fulfilled, the parser fails.
     * @param condition The condition. The 2nd parameter is the user state.
     * @param name The name of the condition the result must satisfy.
     * @param fail The failure type emitted.
     */
    must(condition : (result : T, state : any) => boolean, name ?: string, fail ?: ResultKind) : LoudParser<T>;

    /**
     * P applies this parser and verifies its result is non-empty.
     * An empty result is any of the following: null, undefined, "", [], {}. It is NOT the same as falsy.
     */
    readonly mustBeNonEmpty : LoudParser<boolean>;

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
    mustCapture(kind ?: ResultKind) : LoudParser<T>;
}
/**
 * Created by User on 21-Nov-16.
 */
interface LoudParser<T> {
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
     * Advanced combinator.
     * Applies this parser, and then calls the selector function to determine the parser to apply next.
     * @param selector The selector that selects the loud parser to apply.
     */
    then<TParser extends LoudParser<any>>(selector : (parsed : T) => TParser) : TParser;

    /**
     * P applies this parser exactly {count} times and returns an array of the results.
     * @param count The number of times to apply this parser.
     */
    exactly(count : number) : LoudParser<T[]>;

    /**
     * Applies this parser repeatedly until it fails, returning the results in an array.
     * @param minSuccess The minimum number of times this parser must succeed.
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

    /**
     * P applies this parser repeatedly, every two occurrences separated by the delimeter parser.
     * P succeeds even when delimeter succeeds but this parser fails. In that case, however, input is not consumed by {delimeter}.
     * @param delimeter The delimeter parser.
     * @param max The maximum number of times this parser is applied.
     */
    manySepBy(delimeter : AnyParser, max ?: number) : LoudParser<T>;
}

/**
 * Created by User on 21-Nov-16.
 */
interface LoudParser<T> {
    /**
     * P applies this parser and applies {reducer} to the current state state.
     * The initial internal state is normally undefined.
     * @param reducer Transformation to apply to the state state.
     */
    withState(reducer : (state : any, result : T) => any) : LoudParser<T>;
}
