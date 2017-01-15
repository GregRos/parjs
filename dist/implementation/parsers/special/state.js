"use strict";
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 27-Nov-16.
 */
var PrsState = (function (_super) {
    tslib_1.__extends(PrsState, _super);
    function PrsState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = "state";
        _this.isLoud = true;
        _this.expecting = "anything";
        return _this;
    }
    PrsState.prototype._apply = function (ps) {
        ps.value = ps.state;
        ps.kind = result_1.ResultKind.OK;
    };
    return PrsState;
}(action_1.ParjsAction));
exports.PrsState = PrsState;

//# sourceMappingURL=state.js.map
