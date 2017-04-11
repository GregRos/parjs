"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/combinators
 */ /** */
const action_1 = require("../../action");
const common_1 = require("../../common");
const reply_1 = require("../../../../reply");
/**
 * Created by User on 21-Nov-16.
 */
class PrsMany extends action_1.ParjsAction {
    constructor(inner, maxIterations, minSuccesses) {
        super();
        this.inner = inner;
        this.maxIterations = maxIterations;
        this.minSuccesses = minSuccesses;
        this.displayName = "many";
        this.isLoud = inner.isLoud;
        this.expecting = inner.expecting;
        maxIterations >= minSuccesses || common_1.Issues.willAlwaysFail(this);
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
                common_1.Issues.guardAgainstInfiniteLoop(this);
            }
            position = ps.position;
            arr.maybePush(ps.value);
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