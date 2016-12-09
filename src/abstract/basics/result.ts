/**
 * Created by lifeg on 24/11/2016.
 */

export interface SuccessResult<T> {
    kind : ResultKind.OK;
    value : T;
    state : any;
}

export interface FailResult {
    kind : ResultKind.FatalFail | ResultKind.SoftFail | ResultKind.HardFail;
    state : any;
    expecting : string;
}

export type ParserResult<T> = SuccessResult<T> | FailResult;

export type QuietParserResult = ParserResult<void>;
/**
 *
 */
export enum ResultKind {
    Unknown,
    OK,
    SoftFail,
    HardFail,
    FatalFail
}