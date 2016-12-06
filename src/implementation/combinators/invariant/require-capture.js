"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
/**
 * Created by User on 21-Nov-16.
 */
var PrsMustCapture = (function (_super) {
    __extends(PrsMustCapture, _super);
    function PrsMustCapture(inner, failType) {
        _super.call(this);
        this.inner = inner;
        this.failType = failType;
        this.displayName = "mustCapture";
        this.isLoud = inner.isLoud;
        this.expecting = "internal parser " + inner.displayName + " to consume input";
    }
    PrsMustCapture.prototype._apply = function (ps) {
        var _a = this, inner = _a.inner, failType = _a.failType;
        var position = ps.position;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.result = position !== ps.position ? ResultKind.OK : failType;
    };
    return PrsMustCapture;
}(action_1.ParjsAction));
exports.PrsMustCapture = PrsMustCapture;
