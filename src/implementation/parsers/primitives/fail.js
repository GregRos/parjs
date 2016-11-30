"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
/**
 * Created by lifeg on 24/11/2016.
 */
var PrsFail = (function (_super) {
    __extends(PrsFail, _super);
    function PrsFail() {
        _super.apply(this, arguments);
        this.displayName = "fail";
    }
    PrsFail.prototype._apply = function (ps) {
        ps.result = ResultKind.SoftFail;
    };
    return PrsFail;
}(parser_action_1.JaseBaseParserAction));
exports.PrsFail = PrsFail;
//# sourceMappingURL=fail.js.map