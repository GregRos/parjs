/**
 *
 */
declare enum ResultKind {

    Unknown,
    OK,
    SoftFail,
    HardFail,
    FatalFail
}

/**
 * An interface for abstracting over parser actions.
 */
interface AnyParserAction {
    /**
     * Applies the parser action on the parsing state.
     * @param ps The state on which to apply.
     */
    apply(ps : ParsingState) : void;
    /**
     * Whether this parser action returns a value when it succeeds.
     */
    isLoud : boolean;
    /**
     * A general string that says what the parser action expects for the input.
     */
    expecting : string;
    /**
     * The display name of the parser action.
     */
    displayName : string;
}
/**
 * Created by User on 21-Nov-16.
 */
interface AnyParser {
    /**
     * Exposes the internal parser action. This bit will generally contain the implementation of the parser instance.
     */
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