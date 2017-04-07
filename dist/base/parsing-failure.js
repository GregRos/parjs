"use strict";
class ParsingFailureError extends Error {
    constructor(failure) {
        super(`Parsing failed: ${JSON.stringify(failure, null, 2)}`);
        this.failure = failure;
    }
}
exports.ParsingFailureError = ParsingFailureError;

//# sourceMappingURL=parsing-failure.js.map
