"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
var common_1 = require("../../common");
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
    }
    PrsAltVal.prototype._apply = function (ps) {
        var _a = this, inner = _a.inner, val = _a.val;
        inner.apply(ps);
        if (ps.result.isSoft) {
            //on soft failure, set the value and result to OK
            ps.value = val;
            ps.result = ResultKind.OK;
        }
        //on ok/hard/fatal, propagate the result.
    };
    return PrsAltVal;
}(parser_action_1.JaseParserAction));
exports.PrsAltVal = PrsAltVal;
//# sourceMappingURL=alt-val.js.map