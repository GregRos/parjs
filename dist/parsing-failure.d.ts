/**
 * @module parjs
 */ /** */
import { FailureReply, SuccessReply } from "./internal/reply";
/**
 * An error that is thrown when it is assumed a parser will succeed, but it fails.
 */
export declare class ParsingFailureError extends Error {
    failure: FailureReply;
    constructor(failure: FailureReply);
}
export declare class ParsingSuccessError extends Error {
    success: SuccessReply<any>;
    constructor(success: SuccessReply<any>);
}
