/**
 * @module parjs/internal
 */ /** */
import {ReplyKind} from "../../reply";
import {AnyParserAction} from "../action";

export interface ParsingState {
    /**
     * The original string input on which parsing is performed. Should not be mutated while parsing.
     */
    readonly input : string;
    /**
     * The next character waiting to be parsed.
     */
    position : number;
    /**
     * The value from the last parser action performed on this state.
     */
    value : any;
    /**
     * Additional state data.
     */
    state : any;

    /**
     * A stack that indicates entered parsers.
     */
    stack : AnyParserAction[]

    /**
     * If the result is a failure, this field will indicate the reason for the failure.
     * If the result is OK, this must be undefined.
     */
    expecting : string;
    /**
     * The result of the last parser action: OK, SoftFailure, HardFailure, FatalFailure.
     */
    kind : ReplyKind;

    atLeast(kind : ReplyKind);

    atMost(kind : ReplyKind);

    /**
     * Shorthand for this.result == Okay
     */
    readonly isOk : boolean;
    /**
     * Shorthand for this.result == SoftFailure
     */
    readonly isSoft : boolean;
    /**
     * Shorthand for this.result == HardFailure
     */
    readonly isHard : boolean;
    /**
     * Shorthand for this.result == FatalFailure
     */
    readonly isFatal : boolean;
}