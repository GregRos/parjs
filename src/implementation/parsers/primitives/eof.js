"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by lifeg on 24/11/2016.
 */
var PrsEof = (function (_super) {
    tslib_1.__extends(PrsEof, _super);
    function PrsEof() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isLoud = false;
        _this.displayName = "eof";
        _this.expecting = "end of input";
        return _this;
    }
    PrsEof.prototype._apply = function (ps) {
        if (ps.position === ps.input.length) {
            ps.kind = result_1.ResultKind.OK;
        }
        else {
            ps.kind = result_1.ResultKind.SoftFail;
        }
    };
    return PrsEof;
}(action_1.ParjsBasicAction));
exports.PrsEof = PrsEof;
//# sourceMappingURL=eof.js.map