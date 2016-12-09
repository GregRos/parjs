"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
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
        this.expecting = "anything";
    }
    PrsResult.prototype._apply = function (ps) {
        var result = this.result;
        ps.value = result;
        ps.kind = result_1.ResultKind.OK;
    };
    return PrsResult;
}(action_1.ParjsBasicAction));
exports.PrsResult = PrsResult;
//# sourceMappingURL=result.js.map