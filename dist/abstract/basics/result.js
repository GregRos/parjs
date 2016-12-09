/**
 * Created by lifeg on 24/11/2016.
 */
"use strict";
/**
 *
 */
(function (ResultKind) {
    ResultKind[ResultKind["Unknown"] = 0] = "Unknown";
    ResultKind[ResultKind["OK"] = 1] = "OK";
    ResultKind[ResultKind["SoftFail"] = 2] = "SoftFail";
    ResultKind[ResultKind["HardFail"] = 3] = "HardFail";
    ResultKind[ResultKind["FatalFail"] = 4] = "FatalFail";
})(exports.ResultKind || (exports.ResultKind = {}));
var ResultKind = exports.ResultKind;

//# sourceMappingURL=result.js.map
