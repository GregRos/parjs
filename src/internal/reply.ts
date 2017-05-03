/**
 * @module parjs/internal
 */ /** */
import {ParsingFailureError, ParsingSuccessError} from "../parsing-failure";
import {ReplyKind} from "../reply";
import {prettyPrint} from "./implementation/pretty.print/index";
import {AnyParserAction} from "./action";
import {Parjs} from "../index";

export interface ErrorLocation {
    row : number;
    column : number;
}

/**
 * An object indicating trace information about the state of parsing when it was stopped.
 */
export interface Trace {
    state : object;
    position : number;
    reason : string;
    kind : ReplyKind.Fail;
    location : ErrorLocation;
    stackTrace : AnyParserAction[];
    input : string;
}

/**
 * Used to maintain common members between SuccessReply, FailureReply, and other reply types.
 */
export interface AnyReply<T> {
    readonly kind : ReplyKind;
    readonly value : T;
}

/**
 * Indicates a success reply and contains the value and other information.
 */
export class SuccessReply<T> implements AnyReply<T>{
    kind = ReplyKind.OK;
    constructor(public value : T){

    }

    toString() {
        return `SuccessReply: ${this.value}`;
    }

}

/**
 * Indicates a failure reply and contains information about the failure.
 */
export class FailureReply implements AnyReply<void> {
    constructor(public trace : Trace) {

    }

    get value() : never {
        throw new ParsingFailureError(this);
    }

    get kind() {
        return this.trace.kind;
    }

    toString() {
        return Parjs.visualizer.visualize(this.trace);
    }
}

