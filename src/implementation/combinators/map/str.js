"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var common_1 = require("../../common");
var action_1 = require("../../../base/action");
/**
 * Created by User on 21-Nov-16.
 */
var PrsStr = (function (_super) {
    tslib_1.__extends(PrsStr, _super);
    function PrsStr(inner) {
        var _this = _super.call(this) || this;
        _this.inner = inner;
        _this.displayName = "str";
        _this.isLoud = true;
        _this.expecting = inner.expecting;
        return _this;
    }
    PrsStr.prototype._apply = function (ps) {
        var inner = this.inner;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        var value = ps.value;
        var typeStr = typeof value;
        if (typeStr === "string") {
        }
        else if (value === common_1.QUIET_RESULT) {
            ps.value = "";
        }
        else if (value === null || value === undefined) {
            ps.value = String(value);
        }
        else if (value instanceof Array) {
            ps.value = value.join("");
        }
        else if (typeStr === "symbol") {
            ps.value = String(value).slice(7, -1);
        }
        else {
            ps.value = value.toString();
        }
    };
    return PrsStr;
}(action_1.ParjsAction));
exports.PrsStr = PrsStr;
//# sourceMappingURL=str.js.map