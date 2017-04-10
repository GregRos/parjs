import { FailureReply } from "../abstract/basics/result";
export declare class ParsingFailureError extends Error {
    failure: FailureReply;
    constructor(failure: FailureReply);
}
