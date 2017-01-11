"use strict";
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var char_indicators_1 = require("../../../functions/char-indicators");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 24-Nov-16.
 */
var PrsNewline = (function (_super) {
    tslib_1.__extends(PrsNewline, _super);
    function PrsNewline(matchUnicode) {
        var _this = _super.call(this) || this;
        _this.matchUnicode = matchUnicode;
        _this.displayName = "newline";
        _this.isLoud = true;
        _this.expecting = matchUnicode ? "a unicode newline string" : "a newline string";
        return _this;
    }
    PrsNewline.prototype._apply = function (ps) {
        var position = ps.position, input = ps.input;
        var matchUnicode = this.matchUnicode;
        if (position >= input.length) {
            ps.kind = result_1.ResultKind.SoftFail;
            return;
        }
        var charAt = input.charCodeAt(position);
        if (matchUnicode && char_indicators_1.Codes.isUnicodeNewline(charAt)) {
            ps.position++;
            ps.value = input.charAt(position);
            ps.kind = result_1.ResultKind.OK;
            return;
        }
        if (charAt === char_indicators_1.Codes.newline) {
            ps.position++;
            ps.value = '\n';
            ps.kind = result_1.ResultKind.OK;
            return;
        }
        else if (charAt === char_indicators_1.Codes.carriageReturn) {
            position++;
            if (position < input.length && input.charCodeAt(position) === char_indicators_1.Codes.newline) {
                ps.position = position + 1;
                ps.value = '\r\n';
                ps.kind = result_1.ResultKind.OK;
                return;
            }
            ps.position = position;
            ps.value = '\r';
            ps.kind = result_1.ResultKind.OK;
            return;
        }
        ps.kind = result_1.ResultKind.SoftFail;
    };
    return PrsNewline;
}(action_1.ParjsAction));
exports.PrsNewline = PrsNewline;
//# sourceMappingURL=newline.js.map