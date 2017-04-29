"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal
 */ /** */
const parsing_failure_1 = require("../parsing-failure");
const reply_1 = require("../reply");
const index_1 = require("../index");
/**
 * Indicates a success reply and contains the value and other information.
 */
class SuccessReply {
    constructor(value) {
        this.value = value;
        this.kind = reply_1.ReplyKind.OK;
    }
    toString() {
        return `SuccessReply: ${this.value}`;
    }
}
exports.SuccessReply = SuccessReply;
/**
 * Indicates a failure reply and contains information about the failure.
 */
class FailureReply {
    constructor(trace) {
        this.trace = trace;
    }
    get value() {
        throw new parsing_failure_1.ParsingFailureError(this);
    }
    get kind() {
        return this.trace.kind;
    }
    toString() {
        return index_1.Parjs.visualizer.visualize(this.trace);
    }
}
exports.FailureReply = FailureReply;
//# sourceMappingURL=reply.js.map