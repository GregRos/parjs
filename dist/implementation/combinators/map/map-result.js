"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
/**
 * Created by lifeg on 24/11/2016.
 */
var PrsMapResult = (function (_super) {
    __extends(PrsMapResult, _super);
    function PrsMapResult(inner, result) {
        var _this = _super.call(this) || this;
        _this.inner = inner;
        _this.result = result;
        _this.displayName = "result";
        _this.isLoud = true;
        _this.expecting = inner.expecting;
        return _this;
    }
    PrsMapResult.prototype._apply = function (ps) {
        var _a = this, inner = _a.inner, result = _a.result;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.value = result;
    };
    return PrsMapResult;
}(action_1.ParjsAction));
exports.PrsMapResult = PrsMapResult;

//# sourceMappingURL=map-result.js.map
