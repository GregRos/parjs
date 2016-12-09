"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
var PrsString = (function (_super) {
    __extends(PrsString, _super);
    function PrsString(str) {
        _super.call(this);
        this.str = str;
        this.displayName = "string";
        this.expecting = "'" + str + "'";
    }
    PrsString.prototype._apply = function (ps) {
        var str = this.str;
        var position = ps.position, input = ps.input;
        var i;
        if (position + str.length > input.length) {
            ps.kind = result_1.ResultKind.SoftFail;
            return;
        }
        for (var i_1 = 0; i_1 < str.length; i_1++, position++) {
            if (str.charCodeAt(i_1) !== input.charCodeAt(position)) {
                ps.kind = result_1.ResultKind.SoftFail;
                return;
            }
        }
        ps.position += str.length;
        ps.value = str;
        ps.kind = result_1.ResultKind.OK;
    };
    return PrsString;
}(action_1.ParjsBasicAction));
exports.PrsString = PrsString;
//# sourceMappingURL=string.js.map