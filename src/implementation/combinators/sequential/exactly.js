"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_1 = require("../../../base/action");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
class PrsExactly extends action_1.ParjsAction {
    constructor(inner, count) {
        super();
        this.inner = inner;
        this.count = count;
        this.displayName = "exactly";
        this.isLoud = inner.isLoud;
        this.expecting = inner.expecting;
    }
    _apply(ps) {
        let { inner, count, isLoud } = this;
        let arr = [];
        for (let i = 0; i < count; i++) {
            inner.apply(ps);
            if (!ps.isOk) {
                if (ps.kind === result_1.ReplyKind.SoftFail && i > 0) {
                    ps.kind = result_1.ReplyKind.HardFail;
                }
                //fail because the inner parser has failed.
                return;
            }
            arr.maybePush(ps.value);
        }
        ps.value = arr;
    }
}
exports.PrsExactly = PrsExactly;
//# sourceMappingURL=exactly.js.map