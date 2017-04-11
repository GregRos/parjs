"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/combinators
 */ /** */
const action_1 = require("../../action");
const reply_1 = require("../../../../reply");
class PrsSoft extends action_1.ParjsAction {
    constructor(inner) {
        super();
        this.inner = inner;
        this.displayName = "soft";
        this.isLoud = inner.isLoud;
        this.expecting = inner.expecting;
    }
    _apply(ps) {
        this.inner.apply(ps);
        if (ps.isHard) {
            ps.kind = reply_1.ReplyKind.SoftFail;
        }
    }
}
exports.PrsSoft = PrsSoft;

//# sourceMappingURL=soft.js.map
