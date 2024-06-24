import { ParjsParsingFailure } from "../errors";
import type { Parjser } from "./parjser";
import { visualizeTrace } from "./trace-visualizer";

/** Indicates a success reply and contains the value and other information. */
export class ParjsSuccess<T> implements SuccessInfo<T> {
    /** The kind of the result: OK, Soft, Hard, Fatal. */
    kind = ResultKind.Ok;

    constructor(public value: T) {}

    toString() {
        return `Success: ${this.value}`;
    }

    /** Whether this result is an OK. */
    get isOk() {
        return true;
    }
}

/** Info about a success. */
export interface SuccessInfo<T> {
    kind: ResultKindOk;
    value: T;
}

/** Info about a potential failure. */
export interface FailureInfo {
    kind: ResultKindFail;
    reason: string;
}

/** The line and column of where a failure happened. */
export interface ErrorLocation {
    line: number;
    column: number;
}

/** An object indicating trace information about the state of parsing when it was stopped. */
export interface Trace extends FailureInfo {
    userState: object;
    position: number;
    location: ErrorLocation;
    stackTrace: Parjser<unknown>[];
    input: string;
}

/** A failure result from a Parjs parser. */
export class ParjsFailure implements FailureInfo {
    constructor(public trace: Trace) {}

    get value(): never {
        throw new ParjsParsingFailure(this);
    }

    get kind() {
        return this.trace.kind;
    }

    get reason() {
        return this.trace.reason;
    }

    toString() {
        return visualizeTrace(this.trace);
    }
    /** Whether this result is an OK. */
    get isOk() {
        return false;
    }
}

export function isParjsSuccess<T>(x: unknown): x is ParjsSuccess<T> {
    return x instanceof ParjsSuccess;
}

export function isParjsFailure(x: unknown): x is ParjsFailure {
    return x instanceof ParjsFailure;
}

export function isParjsResult<T>(x: unknown): x is ParjsResult<T> {
    return x instanceof ParjsSuccess || x instanceof ParjsFailure;
}

/** A type that represents a ParjsSuccess or a ParjsFailure. Returned by parsers. */
export type ParjsResult<T> = ParjsSuccess<T> | ParjsFailure;

/** Namespace that contains the different reply kinds/error levels. */
export const ResultKind = {
    /** An OK reply. */
    Ok: "OK" as const,
    /** A soft failure reply. */
    SoftFail: "Soft" as const,
    /** A hard failure reply. */
    HardFail: "Hard" as const,
    /** A fatal failure reply. */
    FatalFail: "Fatal" as const
};

/** The OK reply type. */
export type ResultKindOk = typeof ResultKind.Ok;
/** The soft failure type. */
export type ResultKindSoftFail = typeof ResultKind.SoftFail;
/** The hard failure type. */
export type ResultKindHardFail = typeof ResultKind.HardFail;
/** The fatal failure type. */
export type ResultKindFatalFail = typeof ResultKind.FatalFail;

/** Specifies any kind of failure. */
export type ResultKindFail = ResultKindHardFail | ResultKindFatalFail | ResultKindSoftFail;

/** Specifies a reply kind, indicating success or failure, and the severity of the failure. */
export type ResultKind = ResultKindOk | ResultKindFail;
