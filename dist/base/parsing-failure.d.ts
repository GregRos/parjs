import { FailResult, FailResultKind, ResultKind } from "../abstract/basics/result";
/**
 * Created by lifeg on 29/03/2017.
 */
export declare class ParsingFailureSignal extends Error {
    level: ResultKind;
    constructor(message?: string, severity?: FailResultKind);
}
export declare class ParsingFailureError extends Error {
    failure: FailResult;
    constructor(failure: FailResult);
}
