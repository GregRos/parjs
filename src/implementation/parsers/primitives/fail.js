"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
var common_1 = require("../../common");
/**
 * Created by lifeg on 24/11/2016.
 */
var PrsFail = (function (_super) {
    __extends(PrsFail, _super);
    function PrsFail(kind, expecting) {
        _super.call(this);
        this.kind = kind;
        this.expecting = expecting;
        this.displayName = "fail";
        [result_1.ResultKind.OK, result_1.ResultKind.Unknown].includes(kind) && common_1.Issues.expectedFailureKind(this);
    }
    PrsFail.prototype._apply = function (ps) {
        ps.kind = this.kind;
        ps.expecting = this.expecting;
    };
    return PrsFail;
}(action_1.ParjsBasicAction));
exports.PrsFail = PrsFail;
//# sourceMappingURL=fail.js.map