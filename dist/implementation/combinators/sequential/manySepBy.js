"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var common_1 = require("../../common");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
var PrsManySepBy = (function (_super) {
    tslib_1.__extends(PrsManySepBy, _super);
    function PrsManySepBy(many, sep, maxIterations) {
        var _this = _super.call(this) || this;
        _this.many = many;
        _this.sep = sep;
        _this.maxIterations = maxIterations;
        _this.displayName = "manySepBy";
        _this.isLoud = many.isLoud;
        _this.expecting = many.expecting;
        return _this;
    }
    PrsManySepBy.prototype._apply = function (ps) {
        var _a = this, many = _a.many, sep = _a.sep, maxIterations = _a.maxIterations, isLoud = _a.isLoud;
        var position = ps.position;
        var arr = [];
        many.apply(ps);
        if (ps.kind >= result_1.ResultKind.HardFail) {
            return;
        }
        else if (ps.isSoft) {
            ps.value = [];
            ps.kind = result_1.ResultKind.OK;
            return;
        }
        arr.maybePush(ps.value);
        var i = 1;
        while (true) {
            if (i >= maxIterations)
                break;
            sep.apply(ps);
            if (ps.isSoft) {
                break;
            }
            else if (ps.kind >= result_1.ResultKind.HardFail) {
                return;
            }
            many.apply(ps);
            if (ps.isSoft) {
                break;
            }
            else if (ps.kind >= result_1.ResultKind.HardFail) {
                return;
            }
            if (maxIterations >= Infinity && ps.position === position) {
                common_1.Issues.guardAgainstInfiniteLoop(this);
            }
            arr.maybePush(ps.value);
            position = ps.position;
            i++;
        }
        ps.kind = result_1.ResultKind.OK;
        ps.position = position;
        ps.value = arr;
        return;
    };
    return PrsManySepBy;
}(action_1.ParjsAction));
exports.PrsManySepBy = PrsManySepBy;

//# sourceMappingURL=manySepBy.js.map
