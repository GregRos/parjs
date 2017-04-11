/**
 * @module parjs/internal
 */ /** */
import {ParsingFailureError} from "../parsing-failure";
import {ReplyKind} from "../reply";

/**
 * An object indicating trace information about the state of parsing when it was stopped.
 */
export interface Trace {
    state : object;
    position : number;
    expecting : string;
}

/**
 * Used to maintain common members between SuccessReply, FailureReply, and other reply types.
 */
export interface AnyReply<T> {
    kind : ReplyKind;
    resolve() : T;
}

/**
 * Indicates a success reply and contains the value and other information.
 */
export class SuccessReply<T> implements AnyReply<T>{
    kind = ReplyKind.OK;
    constructor(public value : T){

    }

    resolve() : T {
        return this.value;
    }

    toString() {
        return this.value;
    }
}

/**
 * Indicates a failure reply and contains information about the failure.
 */
export class FailureReply implements AnyReply<void> {
    constructor(public kind : ReplyKind.Fail, public trace : Trace) {

    }
    resolve() : never {
        throw new ParsingFailureError(this);
    }
}

