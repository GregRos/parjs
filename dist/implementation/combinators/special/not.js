"use strict";
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 22-Nov-16.
 */
var PrsNot = (function (_super) {
    tslib_1.__extends(PrsNot, _super);
    function PrsNot(inner) {
        var _this = _super.call(this) || this;
        _this.inner = inner;
        _this.displayName = "not";
        _this.isLoud = false;
        _this.expecting = "not: " + inner.expecting;
        return _this;
    }
    ;
    PrsNot.prototype._apply = function (ps) {
        var inner = this.inner;
        var position = ps.position;
        inner.apply(ps);
        if (ps.isOk) {
            ps.position = position;
            ps.kind = result_1.ResultKind.SoftFail;
        }
        else if (ps.kind <= result_1.ResultKind.HardFail) {
            //hard fails are okay here
            ps.kind = result_1.ResultKind.OK;
            ps.position = position;
            return;
        }
        //the remaining case is a fatal failure that isn't recovered from.
    };
    return PrsNot;
}(action_1.ParjsAction));
exports.PrsNot = PrsNot;

//# sourceMappingURL=not.js.map
