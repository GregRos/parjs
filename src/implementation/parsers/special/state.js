"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 27-Nov-16.
 */
var PrsState = (function (_super) {
    __extends(PrsState, _super);
    function PrsState() {
        _super.apply(this, arguments);
        this.displayName = "state";
        this.isLoud = true;
        this.expecting = "anything";
    }
    PrsState.prototype._apply = function (ps) {
        ps.value = ps.state;
        ps.kind = result_1.ResultKind.OK;
    };
    return PrsState;
}(action_1.ParjsAction));
exports.PrsState = PrsState;
//# sourceMappingURL=state.js.map