"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
var PrsRest = (function (_super) {
    tslib_1.__extends(PrsRest, _super);
    function PrsRest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = "rest";
        _this.isLoud = true;
        _this.expecting = "zero or more characters";
        return _this;
    }
    PrsRest.prototype._apply = function (pr) {
        var position = pr.position, input = pr.input;
        var text = input.substr(Math.min(position, input.length));
        pr.position = input.length;
        pr.value = text;
        pr.kind = result_1.ResultKind.OK;
    };
    return PrsRest;
}(action_1.ParjsBasicAction));
exports.PrsRest = PrsRest;

//# sourceMappingURL=rest.js.map
