/**
 * @module parjs/internal/implementation/parsers
 */ /** */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_1 = require("../../action");
const reply_1 = require("../../../../reply");
/**
 * Created by User on 24-Nov-16.
 */
class PrsCharCodeWhere extends action_1.ParjsBasicAction {
    constructor(predicate, property = "(a specific property)") {
        super();
        this.predicate = predicate;
        this.isLoud = true;
        this.expecting = `any character satisfying ${property}.`;
    }
    _apply(ps) {
        let { predicate } = this;
        let { position, input } = ps;
        if (position >= input.length) {
            ps.kind = reply_1.ReplyKind.SoftFail;
            return;
        }
        let curChar = input.charCodeAt(position);
        if (!predicate(curChar)) {
            ps.kind = reply_1.ReplyKind.SoftFail;
            return;
        }
        ps.value = String.fromCharCode(curChar);
        ps.position++;
        ps.kind = reply_1.ReplyKind.OK;
    }
}
exports.PrsCharCodeWhere = PrsCharCodeWhere;
//# sourceMappingURL=char-code-where.js.map