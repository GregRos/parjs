"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
var common_1 = require("../../common");
/**
 * Created by User on 21-Nov-16.
 */
var PrsManyTill = (function (_super) {
    __extends(PrsManyTill, _super);
    function PrsManyTill(many, till, tillOptional) {
        _super.call(this);
        this.many = many;
        this.till = till;
        this.tillOptional = tillOptional;
        this.displayName = "manyTill";
        this.isLoud = many.isLoud;
    }
    PrsManyTill.prototype._apply = function (ps) {
        var _a = this, many = _a.many, till = _a.till, tillOptional = _a.tillOptional;
        var position = ps.position;
        var arr = [];
        var manyFailed = false;
        while (true) {
            if (till.apply(ps)) {
                break;
            }
            //backtrack to before till failed.
            ps.position = position;
            if (many.apply(ps)) {
                manyFailed = true;
                arr.maybePush(ps.result);
                break;
            }
            if (ps.position === position) {
                common_1.Issues.guardAgainstInfiniteLoop(this);
            }
            position = ps.position;
        }
        if (!manyFailed || tillOptional) {
            return false;
        }
        ps.result = arr;
    };
    return PrsManyTill;
}(parser_action_1.JaseParserAction));
exports.PrsManyTill = PrsManyTill;
//# sourceMappingURL=manyTill.js.map