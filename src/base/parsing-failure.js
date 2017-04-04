"use strict";
/**
 * Created by lifeg on 29/03/2017.
 */
class ParsingFailureSignal extends Error {
    constructor(message, severity = "FatalFail") {
        super(message);
        this.level = severity;
    }
}
exports.ParsingFailureSignal = ParsingFailureSignal;
class ParsingFailureError extends Error {
    constructor(failure) {
        super(`Parsing failed: ${JSON.stringify(failure, null, 2)}`);
        this.failure = failure;
    }
}
exports.ParsingFailureError = ParsingFailureError;
//# sourceMappingURL=parsing-failure.js.map