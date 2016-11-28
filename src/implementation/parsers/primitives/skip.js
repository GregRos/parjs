"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
var common_1 = require("../../common");
/**
 * Created by User on 27-Nov-16.
 */
var PrsSkip = (function (_super) {
    __extends(PrsSkip, _super);
    function PrsSkip(skipCount) {
        _super.call(this);
        this.skipCount = skipCount;
        this.displayName = "skip";
        this.isLoud = false;
    }
    PrsSkip.prototype._apply = function (ps) {
        var skipCount = this.skipCount;
        if (ps.position + skipCount > ps.input.length)
            return false;
        ps.position += skipCount;
        ps.result = common_1.quietReturn;
        return true;
    };
    return PrsSkip;
}(parser_action_1.JaseParserAction));
exports.PrsSkip = PrsSkip;
//# sourceMappingURL=skip.js.map