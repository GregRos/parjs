"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 22-Nov-16.
 */
var PrsStringLen = (function (_super) {
    tslib_1.__extends(PrsStringLen, _super);
    function PrsStringLen(length) {
        var _this = _super.call(this) || this;
        _this.length = length;
        _this.displayName = "stringLen";
        _this.expecting = length + " characters";
        return _this;
    }
    PrsStringLen.prototype._apply = function (ps) {
        var position = ps.position, input = ps.input;
        var length = this.length;
        if (input.length < position + length) {
            ps.kind = result_1.ResultKind.SoftFail;
            return;
        }
        ps.position += length;
        ps.value = input.substr(position, length);
        ps.kind = result_1.ResultKind.OK;
    };
    return PrsStringLen;
}(action_1.ParjsBasicAction));
exports.PrsStringLen = PrsStringLen;

//# sourceMappingURL=string-len.js.map
