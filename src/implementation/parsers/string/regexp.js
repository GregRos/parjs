"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
/**
 * Created by User on 24-Nov-16.
 */
var PrsRegexp = (function (_super) {
    __extends(PrsRegexp, _super);
    function PrsRegexp(regexp) {
        _super.call(this);
        this.regexp = regexp;
        this.displayName = "regexp";
        var flags = [regexp.ignoreCase && "i", regexp.multiline && "m"].filter(function (x) { return x; }).join("");
        var normalizedRegexp = new RegExp(regexp.source, flags);
        regexp = normalizedRegexp;
        this.expecting = "input matching '" + regexp.source + "'";
    }
    PrsRegexp.prototype._apply = function (ps) {
        var input = ps.input, position = ps.position;
        var regexp = this.regexp;
        input = input.substr(position);
        var match = regexp.exec(input);
        if (!match) {
            ps.result = ResultKind.SoftFail;
            return;
        }
        ps.position = regexp.lastIndex;
        var arr = match.slice();
        ps.value = arr;
        ps.result = ResultKind.OK;
    };
    return PrsRegexp;
}(action_1.ParjsBaseParserAction));
exports.PrsRegexp = PrsRegexp;
//# sourceMappingURL=regexp.js.map