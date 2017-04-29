"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/combinators
 */ /** */
const action_1 = require("../../action");
const reply_1 = require("../../../../reply");
const helpers_1 = require("../../functions/helpers");
/**
 * Created by User on 21-Nov-16.
 */
class PrsSeq extends action_1.ParjsAction {
    constructor(parsers) {
        super();
        this.parsers = parsers;
        this.isLoud = true;
        if (parsers.length === 0) {
            this.expecting = "anything";
        }
        else {
            this.expecting = parsers[0].expecting;
        }
    }
    _apply(ps) {
        let { parsers } = this;
        let results = [];
        for (let i = 0; i < parsers.length; i++) {
            let cur = parsers[i];
            cur.apply(ps);
            if (ps.isOk) {
                helpers_1.ArrayHelpers.maybePush(results, ps.value);
            }
            else if (ps.isSoft && i === 0) {
                //if the first parser failed softly then we propagate a soft failure.
                return;
            }
            else if (ps.isSoft) {
                ps.kind = reply_1.ReplyKind.HardFail;
                //if a i > 0 parser failed softly, this is a hard fail for us.
                //also, propagate the internal expectation.
                return;
            }
            else {
                //ps failed hard or fatally. The same severity.
                return;
            }
        }
        ps.value = results;
        ps.kind = reply_1.ReplyKind.OK;
    }
}
exports.PrsSeq = PrsSeq;
//# sourceMappingURL=sequential.js.map