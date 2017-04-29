import { ReplyKind } from "../reply";
export interface ErrorLocation {
    row: number;
    column: number;
}
/**
 * An object indicating trace information about the state of parsing when it was stopped.
 */
export interface Trace {
    state: object;
    position: number;
    expecting: string;
    location: ErrorLocation;
    visualization: string;
    stackTrace: string;
    input: string;
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
    resolveFail(): FailureReply;
    toString(): T;
}
/**
 * Indicates a failure reply and contains information about the failure.
 */
export declare class FailureReply implements AnyReply<void> {
    kind: ReplyKind.Fail;
    trace: Trace;
    constructor(kind: ReplyKind.Fail, trace: Trace);
    resolve(): never;
    resolveFail(): this;
}
