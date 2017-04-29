"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/combinators
 */ /** */
const action_1 = require("../../action");
const issues_1 = require("../../issues");
const reply_1 = require("../../../../reply");
const helpers_1 = require("../../functions/helpers");
/**
 * Created by User on 21-Nov-16.
 */
class PrsMany extends action_1.ParjsAction {
    constructor(inner, maxIterations, minSuccesses) {
        super();
        this.inner = inner;
        this.maxIterations = maxIterations;
        this.minSuccesses = minSuccesses;
        this.isLoud = inner.isLoud;
        this.expecting = inner.expecting;
        maxIterations >= minSuccesses || issues_1.Issues.willAlwaysFail("many");
    }
    _apply(ps) {
        let { inner, maxIterations, minSuccesses } = this;
        let { position } = ps;
        let arr = [];
        let i = 0;
        while (true) {
            inner.apply(ps);
            if (!ps.isOk)
                break;
            if (i >= maxIterations)
                break;
            if (maxIterations === Infinity && ps.position === position) {
                issues_1.Issues.guardAgainstInfiniteLoop("many");
            }
            position = ps.position;
            helpers_1.ArrayHelpers.maybePush(arr, ps.value);
            i++;
        }
        if (ps.atLeast(reply_1.ReplyKind.HardFail)) {
            return;
        }
        if (i < minSuccesses) {
            ps.kind = i === 0 ? reply_1.ReplyKind.SoftFail : reply_1.ReplyKind.HardFail;
            return;
        }
        ps.value = arr;
        //recover from the last failure.
        ps.position = position;
        ps.kind = reply_1.ReplyKind.OK;
    }
}
exports.PrsMany = PrsMany;
//# sourceMappingURL=many.js.map