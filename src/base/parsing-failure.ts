import {FailResult, FailResultKind, ResultKind} from "../abstract/basics/result";

export class ParsingFailureError extends Error {
    constructor(public failure : FailResult) {
        super(`Parsing failed: ${JSON.stringify(failure, null, 2)}`);
    }
}
