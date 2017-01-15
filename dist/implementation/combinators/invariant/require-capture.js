"use strict";
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
var PrsMustCapture = (function (_super) {
    tslib_1.__extends(PrsMustCapture, _super);
    function PrsMustCapture(inner, failType) {
        var _this = _super.call(this) || this;
        _this.inner = inner;
        _this.failType = failType;
        _this.displayName = "mustCapture";
        _this.isLoud = inner.isLoud;
        _this.expecting = "internal parser " + inner.displayName + " to consume input";
        return _this;
    }
    PrsMustCapture.prototype._apply = function (ps) {
        var _a = this, inner = _a.inner, failType = _a.failType;
        var position = ps.position;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.kind = position !== ps.position ? result_1.ResultKind.OK : failType;
    };
    return PrsMustCapture;
}(action_1.ParjsAction));
exports.PrsMustCapture = PrsMustCapture;

//# sourceMappingURL=require-capture.js.map
