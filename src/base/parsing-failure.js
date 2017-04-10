"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ParsingFailureError extends Error {
    constructor(failure) {
        super(`Parsing failed: ${JSON.stringify(failure, null, 2)}`);
        this.failure = failure;
    }
}
exports.ParsingFailureError = ParsingFailureError;
//# sourceMappingURL=parsing-failure.js.map