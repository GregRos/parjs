"use strict";
const action_1 = require("../../../base/action");
const common_1 = require("../../common");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
class PrsManySepBy extends action_1.ParjsAction {
    constructor(many, sep, maxIterations) {
        super();
        this.many = many;
        this.sep = sep;
        this.maxIterations = maxIterations;
        this.displayName = "manySepBy";
        this.isLoud = many.isLoud;
        this.expecting = many.expecting;
    }
    _apply(ps) {
        let { many, sep, maxIterations, isLoud } = this;
        let arr = [];
        many.apply(ps);
        if (ps.atLeast(result_1.ResultKind.HardFail)) {
            return;
        }
        else if (ps.isSoft) {
            ps.value = [];
            ps.kind = result_1.ResultKind.OK;
            return;
        }
        let { position } = ps;
        arr.maybePush(ps.value);
        let i = 1;
        while (true) {
            if (i >= maxIterations)
                break;
            sep.apply(ps);
            if (ps.isSoft) {
                break;
            }
            else if (ps.atLeast(result_1.ResultKind.HardFail)) {
                return;
            }
            many.apply(ps);
            if (ps.isSoft) {
                break;
            }
            else if (ps.atLeast(result_1.ResultKind.HardFail)) {
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
    }
}
exports.PrsManySepBy = PrsManySepBy;
//# sourceMappingURL=manySepBy.js.map