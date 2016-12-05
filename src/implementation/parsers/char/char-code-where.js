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
    function PrsCharCodeWhere(predicate, property) {
        if (property === void 0) { property = "(a specific property)"; }
        _super.call(this);
        this.predicate = predicate;
        this.displayName = "charCodeWhere";
        this.isLoud = true;
        this.expecting = "any character satisfying " + property + ".";
    }
    PrsCharCodeWhere.prototype._apply = function (ps) {
        var predicate = this.predicate;
        var position = ps.position, input = ps.input;
        if (position >= input.length) {
            ps.result = ResultKind.SoftFail;
            return;
        }
        ;
        var curChar = input.charCodeAt(position);
        if (!predicate(curChar)) {
            ps.result = ResultKind.SoftFail;
            return;
        }
        ps.value = String.fromCharCode(curChar);
        ps.position++;
        ps.result = ResultKind.OK;
    };
    return PrsCharCodeWhere;
}(parser_action_1.JaseBaseParserAction));
exports.PrsCharCodeWhere = PrsCharCodeWhere;
//# sourceMappingURL=char-code-where.js.map