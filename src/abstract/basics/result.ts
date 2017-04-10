/**
 * Created by lifeg on 24/11/2016.
 */
import {ParsingFailureError} from "../../base/parsing-failure";

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
    constructor(public kind : FailKind, public trace : Trace) {

    }
    resolve() : never {
        throw new ParsingFailureError(this);
    }
}
/**
 * A type that represents a SuccessReply or a FailureReply. Returned by parsers.
 */
export type Reply<T> = (SuccessReply<T> | FailureReply)

/**
 * A type representing the reply of a quiet parser.
 */
export type QuietReply = Reply<void>;

export module ReplyKind {
    /**
     * An Unknown reply. Used internally.
     */
    export type Unknown = "Unknown";
    /**
     * The OK reply type.
     */
    export type OK = "OK";
    /**
     * The soft failure type.
     */
    export type SoftFail = "SoftFail";
    /**
     * The hard failure type.
     */
    export type HardFail = "HardFail";
    /**
     * The fatal failure type.
     */
    export type FatalFail = "FatalFail";

    /**
     * An Unknown reply.
     * @type {string}
     */
    export const Unknown : Unknown = "Unknown";
    /**
     * An OK reply.
     * @type {string}
     */
    export const OK : OK = "OK";
    /**
     * A soft failure reply.
     * @type {string}
     */
    export const SoftFail : SoftFail = "SoftFail";
    /**
     * A hard failure reply.
     * @type {string}
     */
    export const HardFail : HardFail = "HardFail";
    /**
     * A fatal failure reply.
     * @type {string}
     */
    export const FatalFail : FatalFail = "FatalFail";
}
/**
 * Specifies a reply kind, indicating success or failure, and the severity of the failure.
 */
export type ReplyKind = ReplyKind.OK | ReplyKind.HardFail | ReplyKind.FatalFail | ReplyKind.SoftFail | ReplyKind.Unknown;

/**
 * Specifies a ReplyKind which is a failure.
 */
export type FailKind = ReplyKind.HardFail | ReplyKind.FatalFail | ReplyKind.SoftFail;
