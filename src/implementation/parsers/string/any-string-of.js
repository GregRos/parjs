"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
var AnyStringOf = (function (_super) {
    __extends(AnyStringOf, _super);
    function AnyStringOf(strs) {
        var _this = _super.call(this) || this;
        _this.strs = strs;
        _this.displayName = "anyStringOf";
        _this.isLoud = true;
        _this.expecting = "any of " + strs.map(function (x) { return "'" + x + "'"; }).join(", ");
        return _this;
    }
    AnyStringOf.prototype._apply = function (ps) {
        var position = ps.position, input = ps.input;
        var strs = this.strs;
        strLoop: for (var i = 0; i < strs.length; i++) {
            var curStr = strs[i];
            if (input.length - position < curStr.length)
                continue;
            for (var j = 0; j < curStr.length; j++) {
                if (curStr.charCodeAt(j) !== input.charCodeAt(position + j)) {
                    continue strLoop;
                }
            }
            //this means we did not contiue strLoop so curStr passed our tests
            ps.position = position + curStr.length;
            ps.value = curStr;
            ps.kind = result_1.ResultKind.OK;
            return;
        }
        ps.kind = result_1.ResultKind.SoftFail;
    };
    return AnyStringOf;
}(action_1.ParjsBasicAction));
exports.AnyStringOf = AnyStringOf;
//# sourceMappingURL=any-string-of.js.map