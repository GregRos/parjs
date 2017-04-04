"use strict";
const action_1 = require("../../../base/action");
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