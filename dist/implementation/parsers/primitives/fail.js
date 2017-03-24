"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
var common_1 = require("../../common");
/**
 * Created by lifeg on 24/11/2016.
 */
var PrsFail = (function (_super) {
    tslib_1.__extends(PrsFail, _super);
    function PrsFail(kind, expecting) {
        var _this = _super.call(this) || this;
        _this.kind = kind;
        _this.expecting = expecting;
        _this.displayName = "fail";
        [result_1.ResultKind.OK, result_1.ResultKind.Unknown].includes(kind) && common_1.Issues.expectedFailureKind(_this);
        return _this;
    }
    PrsFail.prototype._apply = function (ps) {
        ps.kind = this.kind;
        ps.expecting = this.expecting;
    };
    return PrsFail;
}(action_1.ParjsBasicAction));
exports.PrsFail = PrsFail;

//# sourceMappingURL=fail.js.map
