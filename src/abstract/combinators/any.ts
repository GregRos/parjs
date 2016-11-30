
declare enum ResultKind {
    OK,
    SoftFail,
    HardFail,
    FatalFail
}


interface AnyParserAction {
    apply(ps : ParsingState) : void;
    isLoud : boolean;
}
/**
 * Created by User on 21-Nov-16.
 */
interface AnyParser {
    action : AnyParserAction;
    /**
     * P applies this parser, and if it succeeds, returns the given value.
     * @param result The value to return.
     */
    result<S>(result : S) : LoudParser<S>;

    /**
     * P applies this parser and forgets the result (if any).
     */
    readonly quiet : QuietParser;

    /**
     * P applies this parser and succeeds without consuming input if this parser fails. P fails if this parser succeeds.
     */
    readonly not : QuietParser;

    readonly isLoud : boolean;
}