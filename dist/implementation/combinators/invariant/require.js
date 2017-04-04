"use strict";
const action_1 = require("../../../base/action");
const common_1 = require("../../common");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
class PrsMust extends action_1.ParjsAction {
    constructor(inner, requirement, failType, qualityName) {
        super();
        this.inner = inner;
        this.requirement = requirement;
        this.failType = failType;
        this.qualityName = qualityName;
        this.displayName = "must";
        this.isLoud = true;
        inner.isLoud || common_1.Issues.quietParserNotPermitted(this);
        this.expecting = `intenral parser ${inner.displayName} yielding a result satisfying ${qualityName}`;
    }
    _apply(ps) {
        let { inner, requirement, failType } = this;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.kind = requirement(ps.value, ps.state) ? result_1.ResultKind.OK : failType;
    }
}
exports.PrsMust = PrsMust;

//# sourceMappingURL=require.js.map
