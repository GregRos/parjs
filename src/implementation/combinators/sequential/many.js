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
var PrsMany = (function (_super) {
    __extends(PrsMany, _super);
    function PrsMany(inner, maxIterations, minSuccesses) {
        _super.call(this);
        this.inner = inner;
        this.maxIterations = maxIterations;
        this.minSuccesses = minSuccesses;
        this.displayName = "many";
        this.isLoud = inner.isLoud;
    }
    PrsMany.prototype._apply = function (ps) {
        var _a = this, inner = _a.inner, maxIterations = _a.maxIterations, minSuccesses = _a.minSuccesses;
        var position = ps.position;
        var arr = [];
        var i = 0;
        while (inner.apply(ps)) {
            if (i >= maxIterations)
                break;
            if (maxIterations < Infinity && ps.position === position) {
                common_1.Issues.guardAgainstInfiniteLoop(this);
            }
            position = ps.position;
            arr.maybePush(ps.result);
            i++;
        }
        if (i < minSuccesses) {
            return false;
        }
        ps.result = arr;
        //recover from the last failure.
        ps.position = position;
        return true;
    };
    return PrsMany;
}(parser_action_1.JaseParserAction));
exports.PrsMany = PrsMany;
//# sourceMappingURL=many.js.map