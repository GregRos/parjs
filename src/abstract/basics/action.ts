/**
 * Created by lifeg on 07/12/2016.
 */
import {ParsingState} from "./state";
/**
 * An interface for abstracting over parser actions.
 */
export interface AnyParserAction {
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