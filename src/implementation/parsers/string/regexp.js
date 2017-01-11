"use strict";
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 24-Nov-16.
 */
var PrsRegexp = (function (_super) {
    tslib_1.__extends(PrsRegexp, _super);
    function PrsRegexp(regexp) {
        var _this = _super.call(this) || this;
        _this.regexp = regexp;
        _this.displayName = "regexp";
        var flags = [regexp.ignoreCase && "i", regexp.multiline && "m"].filter(function (x) { return x; }).join("");
        var normalizedRegexp = new RegExp("^" + regexp.source, flags);
        regexp = normalizedRegexp;
        _this.expecting = "input matching '" + regexp.source + "'";
        return _this;
    }
    PrsRegexp.prototype._apply = function (ps) {
        var input = ps.input, position = ps.position;
        var regexp = this.regexp;
        input = input.substr(position);
        var match = regexp.exec(input);
        if (!match) {
            ps.kind = result_1.ResultKind.SoftFail;
            return;
        }
        ps.position += match[0].length;
        var arr = match.slice(0);
        ps.value = arr;
        ps.kind = result_1.ResultKind.OK;
    };
    return PrsRegexp;
}(action_1.ParjsBasicAction));
exports.PrsRegexp = PrsRegexp;
//# sourceMappingURL=regexp.js.map