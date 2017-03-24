"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
/**
 * Created by lifeg on 24/03/2017.
 */
var PrsLate = (function (_super) {
    tslib_1.__extends(PrsLate, _super);
    function PrsLate(_resolver) {
        var _this = _super.call(this) || this;
        _this._resolver = _resolver;
        _this.displayName = "late (unbound)";
        _this.isLoud = false;
        return _this;
    }
    ;
    PrsLate.prototype._apply = function (ps) {
        if (!this._resolved) {
            this._resolved = this._resolver();
            this.expecting = this._resolved.expecting;
            this.displayName = "late " + this._resolved.displayName;
        }
        return this._resolved.apply(ps);
    };
    return PrsLate;
}(action_1.ParjsAction));
exports.PrsLate = PrsLate;

//# sourceMappingURL=late.js.map
