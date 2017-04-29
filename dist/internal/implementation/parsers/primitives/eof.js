"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/parsers
 */ /** */
const action_1 = require("../../action");
const reply_1 = require("../../../../reply");
/**
 * Created by lifeg on 24/11/2016.
 */
class PrsEof extends action_1.ParjsBasicAction {
    constructor() {
        super(...arguments);
        this.isLoud = false;
        this.expecting = "end of input";
    }
    _apply(ps) {
        if (ps.position === ps.input.length) {
            ps.kind = reply_1.ReplyKind.OK;
        }
        else {
            ps.kind = reply_1.ReplyKind.SoftFail;
        }
    }
}
exports.PrsEof = PrsEof;

//# sourceMappingURL=eof.js.map
