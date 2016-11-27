"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
var common_1 = require("../../common");
/**
 * Created by User on 22-Nov-16.
 */
var PrsNot = (function (_super) {
    __extends(PrsNot, _super);
    function PrsNot(inner) {
        _super.call(this);
        this.inner = inner;
        this.displayName = "not";
        this.isLoud = false;
    }
    ;
    PrsNot.prototype._apply = function (ps) {
        var inner = this.inner;
        var position = ps.position;
        if (inner.apply(ps)) {
            return false;
        }
        ps.position = position;
        ps.result = common_1.quietReturn;
        return true;
    };
    return PrsNot;
}(parser_action_1.JaseParserAction));
exports.PrsNot = PrsNot;
//# sourceMappingURL=not.js.map