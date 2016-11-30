"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
/**
 * Created by User on 22-Nov-16.
 */
var PrsResult = (function (_super) {
    __extends(PrsResult, _super);
    function PrsResult(result) {
        _super.call(this);
        this.result = result;
        this.displayName = "result";
        this.isLoud = true;
    }
    PrsResult.prototype._apply = function (ps) {
        var result = this.result;
        ps.value = result;
        ps.result = parser_action_1.ResultKind.OK;
    };
    return PrsResult;
}(parser_action_1.JaseBaseParserAction));
exports.PrsResult = PrsResult;
//# sourceMappingURL=result.js.map