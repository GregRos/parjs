import {FailResult, FailResultKind, ResultKind} from "../abstract/basics/result";

/**
 * Created by lifeg on 29/03/2017.
 */
export class ParsingFailureSignal extends Error {
    level : ResultKind;
    constructor(message ?: string, severity : FailResultKind = "FatalFail") {
        super(message);
        this.level = severity;
    }
}

export class ParsingFailureError extends Error {
    constructor(public failure : FailResult) {
        super(`Parsing failed: ${JSON.stringify(failure, null, 2)}`);
    }
}
