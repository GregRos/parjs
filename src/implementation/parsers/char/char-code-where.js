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
var PrsCharCodeWhere = (function (_super) {
    __extends(PrsCharCodeWhere, _super);
    function PrsCharCodeWhere(predicate) {
        _super.call(this);
        this.predicate = predicate;
        this.displayName = "charCodeWhere";
        this.isLoud = true;
    }
    PrsCharCodeWhere.prototype._apply = function (ps) {
        var predicate = this.predicate;
        var position = ps.position, input = ps.input;
        if (position >= input.length)
            return false;
        var curChar = input.charCodeAt(position);
        if (!predicate(curChar)) {
            return false;
        }
        ps.result = String.fromCharCode(curChar);
        ps.position++;
        return true;
    };
    return PrsCharCodeWhere;
}(parser_action_1.JaseBaseParserAction));
exports.PrsCharCodeWhere = PrsCharCodeWhere;
//# sourceMappingURL=char-code-where.js.map