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
var PrsMustCapture = (function (_super) {
    __extends(PrsMustCapture, _super);
    function PrsMustCapture(inner) {
        _super.call(this);
        this.inner = inner;
        this.displayName = "mustCapture";
        this.isLoud = inner.isLoud;
    }
    PrsMustCapture.prototype._apply = function (ps) {
        var inner = this.inner;
        var position = ps.position;
        if (!inner.apply(ps)) {
            return false;
        }
        return position !== ps.position;
    };
    return PrsMustCapture;
}(parser_action_1.JaseParserAction));
exports.PrsMustCapture = PrsMustCapture;
//# sourceMappingURL=require-capture.js.map