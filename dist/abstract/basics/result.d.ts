/**
 * An object indicating trace information about the state of parsing when it was stopped.
 */
export interface Trace {
    state: object;
    position: number;
    expecting: string;
}
/**
 * Used to maintain common members between SuccessReply, FailureReply, and other reply types.
 */
export interface AnyReply<T> {
    kind: ReplyKind;
    resolve(): T;
}
/**
 * Indicates a success reply and contains the value and other information.
 */
export declare class SuccessReply<T> implements AnyReply<T> {
    value: T;
    kind: "OK";
    constructor(value: T);
    resolve(): T;
    toString(): T;
}
/**
 * Indicates a failure reply and contains information about the failure.
 */
export declare class FailureReply implements AnyReply<void> {
    kind: FailKind;
    trace: Trace;
    constructor(kind: FailKind, trace: Trace);
    resolve(): never;
}
/**
 * A type that represents a SuccessReply or a FailureReply. Returned by parsers.
 */
export declare type Reply<T> = (SuccessReply<T> | FailureReply);
/**
 * A type representing the reply of a quiet parser.
 */
export declare type QuietReply = Reply<void>;
export declare module ReplyKind {
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
     * @type {string}
     */
    const Unknown: Unknown;
    /**
     * An OK reply.
     * @type {string}
     */
    const OK: OK;
    /**
     * A soft failure reply.
     * @type {string}
     */
    const SoftFail: SoftFail;
    /**
     * A hard failure reply.
     * @type {string}
     */
    const HardFail: HardFail;
    /**
     * A fatal failure reply.
     * @type {string}
     */
    const FatalFail: FatalFail;
}
/**
 * Specifies a reply kind, indicating success or failure, and the severity of the failure.
 */
export declare type ReplyKind = ReplyKind.OK | ReplyKind.HardFail | ReplyKind.FatalFail | ReplyKind.SoftFail | ReplyKind.Unknown;
/**
 * Specifies a ReplyKind which is a failure.
 */
export declare type FailKind = ReplyKind.HardFail | ReplyKind.FatalFail | ReplyKind.SoftFail;
