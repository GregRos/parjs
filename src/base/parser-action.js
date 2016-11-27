"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var common_1 = require("../implementation/common");
/**
 * Created by lifeg on 23/11/2016.
 */
var JaseParserAction = (function () {
    function JaseParserAction() {
    }
    JaseParserAction.prototype.apply = function (ps) {
        var position = ps.position, state = ps.state;
        if (this._apply(ps)) {
            return true;
        }
        else {
            ps.position = position;
            ps.state = state;
            ps.result = common_1.failReturn;
        }
    };
    return JaseParserAction;
}());
exports.JaseParserAction = JaseParserAction;
var JaseBaseParserAction = (function (_super) {
    __extends(JaseBaseParserAction, _super);
    function JaseBaseParserAction() {
        _super.apply(this, arguments);
        this.isLoud = true;
    }
    return JaseBaseParserAction;
}(JaseParserAction));
exports.JaseBaseParserAction = JaseBaseParserAction;
//# sourceMappingURL=parser-action.js.map