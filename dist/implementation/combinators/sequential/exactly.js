"use strict";
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
var PrsExactly = (function (_super) {
    tslib_1.__extends(PrsExactly, _super);
    function PrsExactly(inner, count) {
        var _this = _super.call(this) || this;
        _this.inner = inner;
        _this.count = count;
        _this.displayName = "exactly";
        _this.isLoud = inner.isLoud;
        _this.expecting = inner.expecting;
        return _this;
    }
    PrsExactly.prototype._apply = function (ps) {
        var _a = this, inner = _a.inner, count = _a.count, isLoud = _a.isLoud;
        var arr = [];
        for (var i = 0; i < count; i++) {
            inner.apply(ps);
            if (!ps.isOk) {
                if (ps.kind === result_1.ResultKind.SoftFail && i > 0) {
                    ps.kind = result_1.ResultKind.HardFail;
                }
                //fail because the inner parser has failed.
                return;
            }
            arr.maybePush(ps.value);
        }
        ps.value = arr;
    };
    return PrsExactly;
}(action_1.ParjsAction));
exports.PrsExactly = PrsExactly;

//# sourceMappingURL=exactly.js.map
