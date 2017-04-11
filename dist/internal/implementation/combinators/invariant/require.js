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
        ps.kind = requirement(ps.value, ps.state) ? reply_1.ReplyKind.OK : failType;
    }
}
exports.PrsMust = PrsMust;

//# sourceMappingURL=require.js.map
