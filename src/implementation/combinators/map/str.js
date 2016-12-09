"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var common_1 = require("../../common");
var action_1 = require("../../../base/action");
/**
 * Created by User on 21-Nov-16.
 */
var PrsStr = (function (_super) {
    __extends(PrsStr, _super);
    function PrsStr(inner) {
        _super.call(this);
        this.inner = inner;
        this.displayName = "str";
        this.isLoud = true;
        this.expecting = inner.expecting;
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
            ps.value = Object.prototype.toString.call(value);
        }
        else if (value instanceof Array) {
            ps.value = value.join("");
        }
        else if (typeStr === "symbol") {
            ps.value = value.description;
        }
        else {
            ps.value = value.toString();
        }
    };
    return PrsStr;
}(action_1.ParjsAction));
exports.PrsStr = PrsStr;
//# sourceMappingURL=str.js.map