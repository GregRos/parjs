"use strict";
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var common_1 = require("../../common");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
var PrsAlts = (function (_super) {
    tslib_1.__extends(PrsAlts, _super);
    function PrsAlts(alts) {
        var _this = _super.call(this) || this;
        _this.alts = alts;
        _this.displayName = "alts";
        //if the list is empty, every won't execute and alts[0] won't be called.
        if (!alts.every(function (x) { return x.isLoud === alts[0].isLoud; })) {
            common_1.Issues.mixedLoudnessNotPermitted(_this);
        }
        _this.isLoud = alts.every(function (x) { return x.isLoud === alts[0].isLoud; });
        _this.expecting = "any of: " + alts.join(", ");
        return _this;
    }
    PrsAlts.prototype._apply = function (ps) {
        var position = ps.position;
        var alts = this.alts;
        for (var i = 0; i < alts.length; i++) {
            //go over each alternative.
            var cur = alts[i];
            //apply it on the current state.
            cur.apply(ps);
            if (ps.isOk) {
                //if success, return. The PS records the result.
                return;
            }
            else if (ps.isSoft) {
                //backtrack to the original position and try again.
                ps.position = position;
            }
            else {
                //if failure, return false,
                return;
            }
        }
        ps.kind = result_1.ResultKind.SoftFail;
    };
    return PrsAlts;
}(action_1.ParjsAction));
exports.PrsAlts = PrsAlts;
//# sourceMappingURL=alts.js.map