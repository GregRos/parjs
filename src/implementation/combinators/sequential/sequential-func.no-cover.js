"use strict";
const action_1 = require("../../../base/action");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
class PrsSeqFunc extends action_1.ParjsAction {
    constructor(initial, selector, cache) {
        super();
        this.initial = initial;
        this.selector = selector;
        this.cache = cache;
        this.isLoud = true;
        this.displayName = "seqFunc";
        this.expecting = initial.expecting;
    }
    _apply(ps) {
        let { initial, selector, cache } = this;
        let results = [];
        initial.apply(ps);
        if (!ps.isOk) {
            //propagate the failure of 'initial' upwards.
            return;
        }
        let next;
        let initialResult = ps.value;
        if (cache) {
            next = cache.get(initialResult);
        }
        if (!next) {
            next = selector(initialResult);
        }
        if (!next) {
            ps.kind = result_1.ResultKind.HardFail;
            ps.expecting = "failed to determine the right parser for the input";
            return;
        }
        if (cache) {
            cache.set(initialResult, next);
        }
        next.action.apply(ps);
        if (ps.isSoft) {
            ps.kind = result_1.ResultKind.HardFail;
        }
    }
}
exports.PrsSeqFunc = PrsSeqFunc;
//# sourceMappingURL=sequential-func.no-cover.js.map