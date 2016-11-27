"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
/**
 * Created by User on 21-Nov-16.
 */
var PrsBacktrack = (function (_super) {
    __extends(PrsBacktrack, _super);
    function PrsBacktrack(inner) {
        _super.call(this);
        this.inner = inner;
        this.displayName = "backtrack";
        this.isLoud = inner.isLoud;
    }
    PrsBacktrack.prototype._apply = function (ps) {
        var inner = this.inner;
        var position = ps.position;
        if (!inner.apply(ps)) {
            return false;
        }
        ps.position = position;
        return true;
    };
    return PrsBacktrack;
}(parser_action_1.JaseParserAction));
exports.PrsBacktrack = PrsBacktrack;
//# sourceMappingURL=backtrack.js.map