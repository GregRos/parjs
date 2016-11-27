"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
var common_1 = require("../../common");
/**
 * Created by lifeg on 24/11/2016.
 */
var PrsEof = (function (_super) {
    __extends(PrsEof, _super);
    function PrsEof() {
        _super.apply(this, arguments);
        this.isLoud = false;
        this.displayName = "eof";
    }
    PrsEof.prototype._apply = function (ps) {
        if (ps.position === ps.input.length) {
            ps.result = common_1.quietReturn;
            return true;
        }
        else {
            return false;
        }
    };
    return PrsEof;
}(parser_action_1.JaseBaseParserAction));
exports.PrsEof = PrsEof;
//# sourceMappingURL=eof.js.map