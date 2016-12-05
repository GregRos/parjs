"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
/**
 * Created by User on 27-Nov-16.
 */
var PrsPosition = (function (_super) {
    __extends(PrsPosition, _super);
    function PrsPosition() {
        _super.apply(this, arguments);
        this.displayName = "position";
        this.isLoud = true;
        this.expecting = "anything";
    }
    PrsPosition.prototype._apply = function (ps) {
        ps.value = ps.position;
        ps.result = ResultKind.OK;
    };
    return PrsPosition;
}(parser_action_1.JaseParserAction));
exports.PrsPosition = PrsPosition;
//# sourceMappingURL=position.js.map