/**
 * @module parjs
 */ /** */
import {SuccessReply, FailureReply} from "./internal/reply";



/**
 * A type that represents a SuccessReply or a FailureReply. Returned by parsers.
 */
export type Reply<T> = (SuccessReply<T> | FailureReply);


/**
 * A type representing the reply of a quiet parser.
 */
export type QuietReply = Reply<void>;

/**
 * Namespace that contains the different reply kinds/error levels.
 */
export namespace ReplyKind {
    /**
     * An Unknown reply. Used internally.
     */
    export type Unknown = "Unknown";
    /**
     * The OK reply type.
     */
    export type Ok = "OK";
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
     */
    export const Unknown : Unknown = "Unknown";
    /**
     * An OK reply.
     */
    export const Ok : Ok = "OK";
    /**
     * A soft failure reply.
     */
    export const SoftFail : SoftFail = "SoftFail";
    /**
     * A hard failure reply.
     */
    export const HardFail : HardFail = "HardFail";
    /**
     * A fatal failure reply.
     */
    export const FatalFail : FatalFail = "FatalFail";

    /**
     * Specifies any kind of failure.
     */
    export type Fail = HardFail | FatalFail | SoftFail;
}
/**
 * Specifies a reply kind, indicating success or failure, and the severity of the failure.
 */
export type ReplyKind = ReplyKind.Ok | ReplyKind.Fail | ReplyKind.Unknown;

