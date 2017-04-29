"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/parsers
 */ /** */
const action_1 = require("../../action");
const reply_1 = require("../../../../reply");
/**
 * Created by User on 22-Nov-16.
 */
class PrsStringLen extends action_1.ParjsBasicAction {
    constructor(length) {
        super();
        this.length = length;
        this.expecting = `${length} characters`;
    }
    _apply(ps) {
        let { position, input } = ps;
        let { length } = this;
        if (input.length < position + length) {
            ps.kind = reply_1.ReplyKind.SoftFail;
            return;
        }
        ps.position += length;
        ps.value = input.substr(position, length);
        ps.kind = reply_1.ReplyKind.OK;
    }
}
exports.PrsStringLen = PrsStringLen;
//# sourceMappingURL=string-len.js.map