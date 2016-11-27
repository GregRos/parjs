
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
    or(alt : QuietParser) : QuietParser;

    /**
     * P tries to apply this parser. If it fails, then tries to apply the `parsers` one after the other until one of them succeeds.
     * @param parsers The parsers to try.
     */
    alts(...parsers : QuietParser[]) : QuietParser;
}

/**
 * Created by User on 21-Nov-16.
 */
interface QuietParser {
    //+ Look Ahead

    /**
     * P applies this parser. If it succeeds, it backtracks to the original position in the input, effectively succeeding without consuming input.
     */
    readonly backtrack: QuietParser;
}

/**
 * Created by User on 22-Nov-16.
 */
interface QuietParser {
    /**
     * P applies this parser, and requires that it consume at least one character of the input.
     */
    readonly mustCapture : QuietParser;
}

/**
 * Created by lifeg on 19/11/2016.
 */
interface QuietParser extends AnyParser {
    then<TParser extends AnyParser>(parser : TParser) : TParser;
    then<TParser extends AnyParser>(selector : () => TParser) : TParser;

    /**
     * P applies this parser repeatedly until it fails.
     * @param minSuccess The minimum number of times this parser must succeed.
     * @param maxIterations The maximum number of times this parser is applied.
     */
    many(minSuccess ?: number, maxIterations ?: number) : QuietParser;

    /**
     * P applies this parser repeatedly until the `till` parser succeeds.
     * P fails if this parser fails before the `till` parser does.
     * @param till The parser
     * @param tillOptional Whether or not the `till` parser is optional. I.e. without this, P will behave similarly to a many
     * parser too, terminating once this parser fails.
     */
    manyTill(till : AnyParser, tillOptional ?: boolean) : QuietParser;

    /**
     * P applies this parser repeatedly, every two occurrences separated by the delimeter parser.
     * If `allowTrailing` is true, the delimeter parser follows every occurrence of this parser.
     * @param delimeter The delimeter parser.
     * @param max The maximum number of times this parser is applied.
     */
    manySepBy(delimeter : AnyParser, max ?: number) : QuietParser;

    /**
     * P applies this parser exactly {count} times.
     * @param count The number of times to apply this parser.
     */
    exactly(count : number) : QuietParser;
}

/**
 * Created by User on 21-Nov-16.
 */
interface QuietParser {
    /**
     * P applies this parser and applies {reducer} to the current state state.
     * The initial internal state is normally undefined.
     * @param reducer Transformation to apply to the state state.
     */
    withState(reducer : (state : any) => any) : QuietParser;

}
