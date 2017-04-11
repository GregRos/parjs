"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/combinators
 */ /** */
const action_1 = require("../../action");
const reply_1 = require("../../../../reply");
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
        ps.kind = position !== ps.position ? reply_1.ReplyKind.OK : failType;
    }
}
exports.PrsMustCapture = PrsMustCapture;

//# sourceMappingURL=require-capture.js.map
