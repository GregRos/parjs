"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/parsers
 */ /** */
const action_1 = require("../../action");
const reply_1 = require("../../../../reply");
/**
 * Created by User on 21-Nov-16.
 */
class PrsString extends action_1.ParjsBasicAction {
    constructor(str) {
        super();
        this.str = str;
        this.displayName = "string";
        this.expecting = `'${str}'`;
    }
    _apply(ps) {
        let { str } = this;
        let { position, input } = ps;
        let i;
        if (position + str.length > input.length) {
            ps.kind = reply_1.ReplyKind.SoftFail;
            return;
        }
        for (let i = 0; i < str.length; i++, position++) {
            if (str.charCodeAt(i) !== input.charCodeAt(position)) {
                ps.kind = reply_1.ReplyKind.SoftFail;
                return;
            }
        }
        ps.position += str.length;
        ps.value = str;
        ps.kind = reply_1.ReplyKind.OK;
    }
}
exports.PrsString = PrsString;

//# sourceMappingURL=string.js.map
