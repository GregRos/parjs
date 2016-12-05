"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
/**
 * Created by User on 22-Nov-16.
 */
var PrsStringLen = (function (_super) {
    __extends(PrsStringLen, _super);
    function PrsStringLen(length) {
        _super.call(this);
        this.length = length;
        this.displayName = "stringLen";
        this.expecting = length + " characters";
    }
    PrsStringLen.prototype._apply = function (ps) {
        var position = ps.position, input = ps.input;
        var length = this.length;
        if (input.length < position + length) {
            ps.result = ResultKind.SoftFail;
            return;
        }
        ps.position += length;
        ps.value = input.substr(position, length);
        ps.result = ResultKind.OK;
    };
    return PrsStringLen;
}(parser_action_1.JaseBaseParserAction));
exports.PrsStringLen = PrsStringLen;
//# sourceMappingURL=string-len.js.map