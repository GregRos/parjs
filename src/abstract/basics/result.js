"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by lifeg on 24/11/2016.
 */
const parsing_failure_1 = require("../../base/parsing-failure");
/**
 * Indicates a success reply and contains the value and other information.
 */
class SuccessReply {
    constructor(value) {
        this.value = value;
        this.kind = ReplyKind.OK;
    }
    resolve() {
        return this.value;
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
}
exports.FailureReply = FailureReply;
var ReplyKind;
(function (ReplyKind) {
    /**
     * An Unknown reply.
     * @type {string}
     */
    ReplyKind.Unknown = "Unknown";
    /**
     * An OK reply.
     * @type {string}
     */
    ReplyKind.OK = "OK";
    /**
     * A soft failure reply.
     * @type {string}
     */
    ReplyKind.SoftFail = "SoftFail";
    /**
     * A hard failure reply.
     * @type {string}
     */
    ReplyKind.HardFail = "HardFail";
    /**
     * A fatal failure reply.
     * @type {string}
     */
    ReplyKind.FatalFail = "FatalFail";
})(ReplyKind = exports.ReplyKind || (exports.ReplyKind = {}));
//# sourceMappingURL=result.js.map