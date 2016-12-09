"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
var common_1 = require("../../common");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by lifeg on 23/11/2016.
 */
var PrsAltVal = (function (_super) {
    __extends(PrsAltVal, _super);
    function PrsAltVal(inner, val) {
        _super.call(this);
        this.inner = inner;
        this.val = val;
        this.displayName = "altVal";
        this.isLoud = true;
        inner.isLoud || common_1.Issues.quietParserNotPermitted(this);
        this.expecting = inner.expecting + " or anything";
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
