export declare class SuccessResult<T> {
    value: T;
    kind: "OK";
    constructor(value: T);
    resolve(): T;
}
export interface Trace {
    state: object;
    position: number;
    expecting: string;
}
export declare class FailResult {
    kind: FailResultKind;
    trace: Trace;
    constructor(kind: FailResultKind, trace: Trace);
    resolve(): never;
}
export declare type ParserResult<T> = (SuccessResult<T> | FailResult);
export declare type QuietParserResult = ParserResult<void>;
/**
 *
 */
export declare module ResultKind {
    type Unknown = "Unknown";
    type OK = "OK";
    type SoftFail = "SoftFail";
    type HardFail = "HardFail";
    type FatalFail = "FatalFail";
    const Unknown: Unknown;
    const OK: OK;
    const SoftFail: SoftFail;
    const HardFail: HardFail;
    const FatalFail: FatalFail;
}
export declare type ResultKind = ResultKind.OK | ResultKind.HardFail | ResultKind.FatalFail | ResultKind.SoftFail | ResultKind.Unknown;
export declare type FailResultKind = ResultKind.HardFail | ResultKind.FatalFail | ResultKind.SoftFail;
