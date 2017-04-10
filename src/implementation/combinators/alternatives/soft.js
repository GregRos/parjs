"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by User on 13-Dec-16.
 */
const action_1 = require("../../../base/action");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
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
            ps.kind = result_1.ReplyKind.SoftFail;
        }
    }
}
exports.PrsSoft = PrsSoft;
//# sourceMappingURL=soft.js.map