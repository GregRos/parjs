"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 27-Nov-16.
 */
var PrsPosition = (function (_super) {
    tslib_1.__extends(PrsPosition, _super);
    function PrsPosition() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = "position";
        _this.isLoud = true;
        _this.expecting = "anything";
        return _this;
    }
    PrsPosition.prototype._apply = function (ps) {
        ps.value = ps.position;
        ps.kind = result_1.ResultKind.OK;
    };
    return PrsPosition;
}(action_1.ParjsAction));
exports.PrsPosition = PrsPosition;
//# sourceMappingURL=position.js.map