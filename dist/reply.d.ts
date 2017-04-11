import { SuccessReply, FailureReply } from "./internal/reply";
/**
 * A type that represents a SuccessReply or a FailureReply. Returned by parsers.
 */
export declare type Reply<T> = (SuccessReply<T> | FailureReply);
/**
 * A type representing the reply of a quiet parser.
 */
export declare type QuietReply = Reply<void>;
export declare namespace ReplyKind {
    /**
     * An Unknown reply. Used internally.
     */
    type Unknown = "Unknown";
    /**
     * The OK reply type.
     */
    type OK = "OK";
    /**
     * The soft failure type.
     */
    type SoftFail = "SoftFail";
    /**
     * The hard failure type.
     */
    type HardFail = "HardFail";
    /**
     * The fatal failure type.
     */
    type FatalFail = "FatalFail";
    /**
     * An Unknown reply.
     */
    const Unknown: Unknown;
    /**
     * An OK reply.
     */
    const OK: OK;
    /**
     * A soft failure reply.
     */
    const SoftFail: SoftFail;
    /**
     * A hard failure reply.
     */
    const HardFail: HardFail;
    /**
     * A fatal failure reply.
     */
    const FatalFail: FatalFail;
    /**
     * Specifies any kind of failure.
     */
    type Fail = HardFail | FatalFail | SoftFail;
}
/**
 * Specifies a reply kind, indicating success or failure, and the severity of the failure.
 */
export declare type ReplyKind = ReplyKind.OK | ReplyKind.Fail | ReplyKind.Unknown;
