"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var common_1 = require("../../common");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by lifeg on 23/11/2016.
 */
var PrsAltVal = (function (_super) {
    tslib_1.__extends(PrsAltVal, _super);
    function PrsAltVal(inner, val) {
        var _this = _super.call(this) || this;
        _this.inner = inner;
        _this.val = val;
        _this.displayName = "altVal";
        _this.isLoud = true;
        inner.isLoud || common_1.Issues.quietParserNotPermitted(_this);
        _this.expecting = inner.expecting + " or anything";
        return _this;
    }
    PrsAltVal.prototype._apply = function (ps) {
        var _a = this, inner = _a.inner, val = _a.val;
        inner.apply(ps);
        if (ps.isSoft) {
            //on soft failure, set the value and result to OK
            ps.value = val;
            ps.kind = result_1.ResultKind.OK;
        }
        //on ok/hard/fatal, propagate the result.
    };
    return PrsAltVal;
}(action_1.ParjsAction));
exports.PrsAltVal = PrsAltVal;

//# sourceMappingURL=alt-val.js.map
