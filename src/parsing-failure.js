"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An error that is thrown when it is assumed a parser will succeed, but it fails.
 */
class ParsingFailureError extends Error {
    constructor(failure) {
        super(`Attempted to get the value of a failure reply!\n${failure.toString()}`);
        this.failure = failure;
    }
}
exports.ParsingFailureError = ParsingFailureError;
class ParsingSuccessError extends Error {
    constructor(success) {
        super(`Expected parsing to fail, but it succeeded.`);
        this.success = success;
    }
}
exports.ParsingSuccessError = ParsingSuccessError;
//# sourceMappingURL=parsing-failure.js.map