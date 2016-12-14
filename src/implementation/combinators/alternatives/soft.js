"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by User on 13-Dec-16.
 */
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
var PrsSoft = (function (_super) {
    __extends(PrsSoft, _super);
    function PrsSoft(inner) {
        var _this = _super.call(this) || this;
        _this.inner = inner;
        _this.displayName = "soft";
        _this.isLoud = inner.isLoud;
        _this.expecting = inner.expecting;
        return _this;
    }
    PrsSoft.prototype._apply = function (ps) {
        this.inner.apply(ps);
        if (ps.isHard) {
            ps.kind = result_1.ResultKind.SoftFail;
        }
    };
    return PrsSoft;
}(action_1.ParjsAction));
exports.PrsSoft = PrsSoft;
//# sourceMappingURL=soft.js.map