"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by lifeg on 24/11/2016.
 */
var PrsFail = (function (_super) {
    __extends(PrsFail, _super);
    function PrsFail() {
        _super.apply(this, arguments);
        this.displayName = "fail";
        this.expecting = "no input";
    }
    PrsFail.prototype._apply = function (ps) {
        ps.kind = result_1.ResultKind.SoftFail;
    };
    return PrsFail;
}(action_1.ParjsBasicAction));
exports.PrsFail = PrsFail;

//# sourceMappingURL=fail.js.map
