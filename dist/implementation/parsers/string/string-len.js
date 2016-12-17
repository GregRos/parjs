"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 22-Nov-16.
 */
var PrsStringLen = (function (_super) {
    __extends(PrsStringLen, _super);
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
