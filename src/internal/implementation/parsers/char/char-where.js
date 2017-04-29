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
class PrsCharWhere extends action_1.ParjsBasicAction {
    constructor(predicate, expecting = "(some property)") {
        super();
        this.predicate = predicate;
        this.isLoud = true;
        this.expecting = `a char matching: ${expecting}`;
    }
    _apply(ps) {
        let { predicate } = this;
        let { position, input } = ps;
        if (position >= input.length) {
            ps.kind = reply_1.ReplyKind.SoftFail;
            return;
        }
        let curChar = input[position];
        if (!predicate(curChar)) {
            ps.kind = reply_1.ReplyKind.SoftFail;
            return;
        }
        ps.value = curChar;
        ps.position++;
        ps.kind = reply_1.ReplyKind.OK;
    }
}
exports.PrsCharWhere = PrsCharWhere;
//# sourceMappingURL=char-where.js.map