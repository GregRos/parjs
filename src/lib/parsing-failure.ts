/**
 * @module parjs
 */ /** */
import {FailureReply, SuccessReply} from "./internal/reply";


/**
 * An error that is thrown when it is assumed a parser will succeed, but it fails.
 */
export class ParsingFailureError extends Error {
    constructor(public failure : FailureReply) {
        super(`Attempted to get the value of a failure reply!\n${failure.toString()}`);
    }
}

export class ParsingSuccessError extends Error {
    constructor(public success : SuccessReply<any>) {
        super(`Expected parsing to fail, but it succeeded.`);
    }
}