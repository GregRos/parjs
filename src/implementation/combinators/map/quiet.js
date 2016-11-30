"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
/**
 * Created by lifeg on 24/11/2016.
 */
var PrsQuiet = (function (_super) {
    __extends(PrsQuiet, _super);
    function PrsQuiet(inner) {
        _super.call(this);
        this.inner = inner;
        this.displayName = "quiet";
        this.isLoud = false;
    }
    PrsQuiet.prototype._apply = function (ps) {
        var inner = this.inner;
        inner.apply(ps);
    };
    return PrsQuiet;
}(parser_action_1.JaseParserAction));
exports.PrsQuiet = PrsQuiet;
//# sourceMappingURL=quiet.js.map