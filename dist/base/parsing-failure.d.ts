import { FailResult } from "../abstract/basics/result";
export declare class ParsingFailureError extends Error {
    failure: FailResult;
    constructor(failure: FailResult);
}
