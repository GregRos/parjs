"use strict";
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
/**
 * Created by User on 21-Nov-16.
 */
var PrsBacktrack = (function (_super) {
    tslib_1.__extends(PrsBacktrack, _super);
    function PrsBacktrack(inner) {
        var _this = _super.call(this) || this;
        _this.inner = inner;
        _this.displayName = "backtrack";
        _this.isLoud = inner.isLoud;
        _this.expecting = inner.expecting;
        return _this;
    }
    PrsBacktrack.prototype._apply = function (ps) {
        var inner = this.inner;
        var position = ps.position;
        inner.apply(ps);
        if (ps.isOk) {
            //if inner succeeded, we backtrack.
            ps.position = position;
        }
        //whatever code ps had, we return it.
    };
    return PrsBacktrack;
}(action_1.ParjsAction));
exports.PrsBacktrack = PrsBacktrack;

//# sourceMappingURL=backtrack.js.map
