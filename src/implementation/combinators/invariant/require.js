"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var common_1 = require("../../common");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
var PrsMust = (function (_super) {
    tslib_1.__extends(PrsMust, _super);
    function PrsMust(inner, requirement, failType, qualityName) {
        var _this = _super.call(this) || this;
        _this.inner = inner;
        _this.requirement = requirement;
        _this.failType = failType;
        _this.qualityName = qualityName;
        _this.displayName = "must";
        _this.isLoud = true;
        inner.isLoud || common_1.Issues.quietParserNotPermitted(_this);
        _this.expecting = "intenral parser " + inner.displayName + " yielding a result satisfying " + qualityName;
        return _this;
    }
    PrsMust.prototype._apply = function (ps) {
        var _a = this, inner = _a.inner, requirement = _a.requirement, failType = _a.failType;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.kind = requirement(ps.value) ? result_1.ResultKind.OK : failType;
    };
    return PrsMust;
}(action_1.ParjsAction));
exports.PrsMust = PrsMust;
//# sourceMappingURL=require.js.map