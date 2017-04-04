"use strict";
const action_1 = require("../../../base/action");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
class PrsMustCapture extends action_1.ParjsAction {
    constructor(inner, failType) {
        super();
        this.inner = inner;
        this.failType = failType;
        this.displayName = "mustCapture";
        this.isLoud = inner.isLoud;
        this.expecting = `internal parser ${inner.displayName} to consume input`;
    }
    _apply(ps) {
        let { inner, failType } = this;
        let { position } = ps;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.kind = position !== ps.position ? result_1.ResultKind.OK : failType;
    }
}
exports.PrsMustCapture = PrsMustCapture;
//# sourceMappingURL=require-capture.js.map