"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal
 */ /** */
const parsing_failure_1 = require("../parsing-failure");
const reply_1 = require("../reply");
/**
 * Indicates a success reply and contains the value and other information.
 */
class SuccessReply {
    constructor(value) {
        this.value = value;
        this.kind = reply_1.ReplyKind.OK;
    }
    resolve() {
        return this.value;
    }
    resolveFail() {
        throw new parsing_failure_1.ParsingSuccessError(this);
    }
    toString() {
        return this.value;
    }
}
exports.SuccessReply = SuccessReply;
/**
 * Indicates a failure reply and contains information about the failure.
 */
class FailureReply {
    constructor(kind, trace) {
        this.kind = kind;
        this.trace = trace;
    }
    resolve() {
        throw new parsing_failure_1.ParsingFailureError(this);
    }
    resolveFail() {
        return this;
    }
}
exports.FailureReply = FailureReply;

//# sourceMappingURL=reply.js.map
