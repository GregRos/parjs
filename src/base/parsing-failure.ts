import {FailureReply, FailKind, ReplyKind} from "../abstract/basics/result";

export class ParsingFailureError extends Error {
    constructor(public failure : FailureReply) {
        super(`Parsing failed: ${JSON.stringify(failure, null, 2)}`);
    }
}
