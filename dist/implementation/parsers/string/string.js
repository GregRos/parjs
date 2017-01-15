"use strict";
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
var PrsString = (function (_super) {
    tslib_1.__extends(PrsString, _super);
    function PrsString(str) {
        var _this = _super.call(this) || this;
        _this.str = str;
        _this.displayName = "string";
        _this.expecting = "'" + str + "'";
        return _this;
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
