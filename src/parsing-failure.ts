/**
 * @module parjs
 */ /** */
import {FailureReply} from "./internal/reply";

/**
 * An error that is thrown when it is assumed a parser will succeed, but it fails.
 */
export class ParsingFailureError extends Error {
    constructor(public failure : FailureReply) {
        super(`Parsing failed: ${JSON.stringify(failure, null, 2)}`);
    }
}
