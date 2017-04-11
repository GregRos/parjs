"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/combinators
 */ /** */
const action_1 = require("../../action");
const common_1 = require("../../common");
const reply_1 = require("../../../../reply");
class PrsAltVal extends action_1.ParjsAction {
    constructor(inner, val) {
        super();
        this.inner = inner;
        this.val = val;
        this.displayName = "altVal";
        this.isLoud = true;
        inner.isLoud || common_1.Issues.quietParserNotPermitted(this);
        this.expecting = `${inner.expecting} or anything`;
    }
    _apply(ps) {
        let { inner, val } = this;
        inner.apply(ps);
        if (ps.isSoft) {
            //on soft failure, set the value and result to OK
            ps.value = val;
            ps.kind = reply_1.ReplyKind.OK;
        }
        //on ok/hard/fatal, propagate the result.
    }
}
exports.PrsAltVal = PrsAltVal;

//# sourceMappingURL=alt-val.js.map
