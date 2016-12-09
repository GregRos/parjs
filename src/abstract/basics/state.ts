import {ResultKind} from "./result";
/**
 * Created by User on 21-Nov-16.
 */
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
     * If the result is a failure, this field will indicate the reason for the failure.
     * If the result is OK, this must be undefined.
     */
    expecting : string;
    /**
     * The result of the last parser action: OK, SoftFailure, HardFailure, FatalFailure.
     */
    kind : ResultKind;
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