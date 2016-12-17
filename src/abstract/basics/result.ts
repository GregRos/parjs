/**
 * Created by lifeg on 24/11/2016.
 */
import _ = require('lodash');
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

export type FailIndicator =
    ResultKind.SoftFail | ResultKind.HardFail | ResultKind.FatalFail |
        "SoftFail" | "HardFail" | "FatalFail";

export function toResultKind(indicator : FailIndicator) : ResultKind {
    if (typeof indicator !== 'number') {
        switch (indicator) {
            case "FatalFail":
                indicator = ResultKind.FatalFail;
                break;
            case "HardFail":
                indicator = ResultKind.HardFail;
                break;
            case "SoftFail":
                indicator = ResultKind.SoftFail;
                break;
            default:
                indicator = ResultKind.Unknown as any;
                break;
        }
        return indicator as ResultKind;
    }
    return indicator;
}