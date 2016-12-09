/**
 * Created by lifeg on 24/11/2016.
 */
export interface SuccessResult<T> {
    kind: ResultKind.OK;
    value: T;
    state: any;
}
export interface FailResult {
    kind: ResultKind.FatalFail | ResultKind.SoftFail | ResultKind.HardFail;
    state: any;
    expecting: string;
}
export declare type ParserResult<T> = SuccessResult<T> | FailResult;
export declare type QuietParserResult = ParserResult<void>;
/**
 *
 */
export declare enum ResultKind {
    Unknown = 0,
    OK = 1,
    SoftFail = 2,
    HardFail = 3,
    FatalFail = 4,
}
