"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
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
        this.expecting = many.expecting;
    }
    PrsManySepBy.prototype._apply = function (ps) {
        var _a = this, many = _a.many, sep = _a.sep, maxIterations = _a.maxIterations, isLoud = _a.isLoud;
        var position = ps.position;
        var arr = [];
        many.apply(ps);
        if (ps.result >= ResultKind.HardFail) {
            return;
        }
        else if (ps.isSoft) {
            ps.value = [];
            return;
        }
        var i = 0;
        while (true) {
            if (i >= maxIterations)
                break;
            sep.apply(ps);
            if (ps.isSoft) {
                break;
            }
            else if (ps.result >= ResultKind.HardFail) {
                return;
            }
            many.apply(ps);
            if (ps.isSoft) {
                break;
            }
            else if (ps.result >= ResultKind.HardFail) {
                return;
            }
            if (maxIterations >= Infinity && ps.position === position) {
                common_1.Issues.guardAgainstInfiniteLoop(this);
            }
            arr.maybePush(ps.value);
            position = ps.position;
            i++;
        }
        ps.result = ResultKind.OK;
        ps.position = position;
        ps.value = arr;
        return;
    };
    return PrsManySepBy;
}(action_1.ParjsParserAction));
exports.PrsManySepBy = PrsManySepBy;
//# sourceMappingURL=manySepBy.js.map