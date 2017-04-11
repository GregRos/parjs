"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/combinators
 */ /** */
const action_1 = require("../../action");
/**
 * Created by lifeg on 24/11/2016.
 */
class PrsMapResult extends action_1.ParjsAction {
    constructor(inner, result) {
        super();
        this.inner = inner;
        this.result = result;
        this.displayName = "result";
        this.isLoud = true;
        this.expecting = inner.expecting;
    }
    _apply(ps) {
        let { inner, result } = this;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.value = result;
    }
}
exports.PrsMapResult = PrsMapResult;

//# sourceMappingURL=map-result.js.map
