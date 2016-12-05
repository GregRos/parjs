"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
var common_1 = require("../../common");
/**
 * Created by User on 21-Nov-16.
 */
var PrsMust = (function (_super) {
    __extends(PrsMust, _super);
    function PrsMust(inner, requirement, failType, qualityName) {
        _super.call(this);
        this.inner = inner;
        this.requirement = requirement;
        this.failType = failType;
        this.qualityName = qualityName;
        this.displayName = "must";
        this.isLoud = true;
        inner.isLoud || common_1.Issues.quietParserNotPermitted(this);
        this.expecting = "intenral parser " + inner.displayName + " yielding a result satisfying " + qualityName;
    }
    PrsMust.prototype._apply = function (ps) {
        var _a = this, inner = _a.inner, requirement = _a.requirement, failType = _a.failType;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.result = requirement(ps.value) ? ResultKind.OK : failType;
    };
    return PrsMust;
}(parser_action_1.JaseParserAction));
exports.PrsMust = PrsMust;
//# sourceMappingURL=require.js.map