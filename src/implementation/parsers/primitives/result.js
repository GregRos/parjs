"use strict";
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 22-Nov-16.
 */
var PrsResult = (function (_super) {
    tslib_1.__extends(PrsResult, _super);
    function PrsResult(result) {
        var _this = _super.call(this) || this;
        _this.result = result;
        _this.displayName = "result";
        _this.isLoud = true;
        _this.expecting = "anything";
        return _this;
    }
    PrsResult.prototype._apply = function (ps) {
        var result = this.result;
        ps.value = result;
        ps.kind = result_1.ResultKind.OK;
    };
    return PrsResult;
}(action_1.ParjsBasicAction));
exports.PrsResult = PrsResult;
//# sourceMappingURL=result.js.map