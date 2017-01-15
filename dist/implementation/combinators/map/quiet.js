"use strict";
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
/**
 * Created by lifeg on 24/11/2016.
 */
var PrsQuiet = (function (_super) {
    tslib_1.__extends(PrsQuiet, _super);
    function PrsQuiet(inner) {
        var _this = _super.call(this) || this;
        _this.inner = inner;
        _this.displayName = "quiet";
        _this.isLoud = false;
        _this.expecting = inner.expecting;
        return _this;
    }
    PrsQuiet.prototype._apply = function (ps) {
        var inner = this.inner;
        inner.apply(ps);
    };
    return PrsQuiet;
}(action_1.ParjsAction));
exports.PrsQuiet = PrsQuiet;

//# sourceMappingURL=quiet.js.map
