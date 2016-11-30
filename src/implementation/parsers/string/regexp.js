"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
/**
 * Created by User on 24-Nov-16.
 */
var PrsRegexp = (function (_super) {
    __extends(PrsRegexp, _super);
    function PrsRegexp(regexp) {
        _super.call(this);
        this.regexp = regexp;
        this.displayName = "regexp";
        var flags = regexp.flags.replace(/(g|y)/i, "");
        var normalizedRegexp = new RegExp(regexp.source, flags);
        regexp = normalizedRegexp;
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
}(parser_action_1.JaseBaseParserAction));
exports.PrsRegexp = PrsRegexp;
//# sourceMappingURL=regexp.js.map