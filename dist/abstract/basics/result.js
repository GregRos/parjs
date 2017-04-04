"use strict";
const parsing_failure_1 = require("../../base/parsing-failure");
class SuccessResult {
    constructor(value) {
        this.value = value;
        this.kind = ResultKind.OK;
    }
    get resolve() {
        return this.value;
    }
}
exports.SuccessResult = SuccessResult;
class FailResult {
    constructor(kind, trace) {
        this.kind = kind;
        this.trace = trace;
    }
    get resolve() {
        throw new parsing_failure_1.ParsingFailureError(this);
    }
}
exports.FailResult = FailResult;
/**
 *
 */
var ResultKind;
(function (ResultKind) {
    ResultKind.Unknown = "Unknown";
    ResultKind.OK = "OK";
    ResultKind.SoftFail = "SoftFail";
    ResultKind.HardFail = "HardFail";
    ResultKind.FatalFail = "FatalFail";
})(ResultKind = exports.ResultKind || (exports.ResultKind = {}));

//# sourceMappingURL=result.js.map
