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
var PrsManySepBy = (function (_super) {
    __extends(PrsManySepBy, _super);
    function PrsManySepBy(many, sep, maxIterations) {
        _super.call(this);
        this.many = many;
        this.sep = sep;
        this.maxIterations = maxIterations;
        this.displayName = "manySepBy";
        this.isLoud = many.isLoud;
    }
    PrsManySepBy.prototype._apply = function (ps) {
        var _a = this, many = _a.many, sep = _a.sep, maxIterations = _a.maxIterations, isLoud = _a.isLoud;
        var position = ps.position;
        var arr = [];
        if (!many.apply(ps)) {
            return false;
        }
        var manyFailed = false;
        var i = 0;
        while (true) {
            if (i > maxIterations)
                break;
            if (!sep.apply(ps)) {
                break;
            }
            if (!many.apply(ps)) {
                manyFailed = true;
                break;
            }
            if (maxIterations < Infinity && ps.position === position) {
                common_1.Issues.guardAgainstInfiniteLoop(this);
            }
            arr.maybePush(ps.result);
            position = ps.position;
            i++;
        }
        ps.position = position;
        ps.result = arr;
        return true;
    };
    return PrsManySepBy;
}(parser_action_1.JaseParserAction));
exports.PrsManySepBy = PrsManySepBy;
//# sourceMappingURL=manySepBy.js.map