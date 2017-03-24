"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
var ResultKind;
(function (ResultKind) {
    ResultKind[ResultKind["Unknown"] = 0] = "Unknown";
    ResultKind[ResultKind["OK"] = 1] = "OK";
    ResultKind[ResultKind["SoftFail"] = 2] = "SoftFail";
    ResultKind[ResultKind["HardFail"] = 3] = "HardFail";
    ResultKind[ResultKind["FatalFail"] = 4] = "FatalFail";
})(ResultKind = exports.ResultKind || (exports.ResultKind = {}));
function toResultKind(indicator) {
    if (typeof indicator !== 'number') {
        switch (indicator) {
            case "FatalFail":
                indicator = ResultKind.FatalFail;
                break;
            case "HardFail":
                indicator = ResultKind.HardFail;
                break;
            case "SoftFail":
                indicator = ResultKind.SoftFail;
                break;
            default:
                indicator = ResultKind.Unknown;
                break;
        }
        return indicator;
    }
    return indicator;
}
exports.toResultKind = toResultKind;
//# sourceMappingURL=result.js.map