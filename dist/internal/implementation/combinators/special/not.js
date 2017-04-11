"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/combinators
 */ /** */
const action_1 = require("../../action");
const reply_1 = require("../../../../reply");
/**
 * Created by User on 22-Nov-16.
 */
class PrsNot extends action_1.ParjsAction {
    constructor(inner) {
        super();
        this.inner = inner;
        this.displayName = "not";
        this.isLoud = false;
        this.expecting = `not: ${inner.expecting}`;
    }
    ;
    _apply(ps) {
        let { inner } = this;
        let { position } = ps;
        inner.apply(ps);
        if (ps.isOk) {
            ps.position = position;
            ps.kind = reply_1.ReplyKind.SoftFail;
        }
        else if (ps.kind === reply_1.ReplyKind.HardFail || ps.kind === reply_1.ReplyKind.SoftFail) {
            //hard fails are okay here
            ps.kind = reply_1.ReplyKind.OK;
            ps.position = position;
            return;
        }
        //the remaining case is a fatal failure that isn't recovered from.
    }
}
exports.PrsNot = PrsNot;

//# sourceMappingURL=not.js.map
