"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var common_1 = require("../../common");
var parser_action_1 = require("../../../base/parser-action");
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
    }
    PrsStr.prototype._apply = function (ps) {
        var inner = this.inner;
        if (!inner.apply(ps)) {
            return false;
        }
        var result = ps.result;
        var typeStr = typeof result;
        if (typeStr === "string") {
        }
        else if (result === common_1.quietReturn) {
            ps.result = "";
        }
        else if (result === null || result === undefined) {
            ps.result = Object.prototype.toString.call(result);
        }
        else if (result instanceof Array) {
            ps.result = result.join("");
        }
        else if (typeStr === "symbol") {
            ps.result = result.description;
        }
        else {
            ps.result = result.toString();
        }
        return true;
    };
    return PrsStr;
}(parser_action_1.JaseParserAction));
exports.PrsStr = PrsStr;
//# sourceMappingURL=str.js.map