"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/parsers
 */ /** */
const action_1 = require("../../action");
const parselets_1 = require("./parselets");
const reply_1 = require("../../../../reply");
class PrsInt extends action_1.ParjsAction {
    constructor(options) {
        super();
        this.options = options;
        this.isLoud = true;
        if (options.base > 36) {
            throw new Error("invalid base");
        }
        this.expecting = `a ${options.allowSign ? "signed" : "unsigned"} integer in base ${options.base}`;
    }
    _apply(ps) {
        let { options: { allowSign, base } } = this;
        let { position, input } = ps;
        let initPos = ps.position;
        let sign = allowSign ? parselets_1.Parselets.parseSign(ps) : 0;
        let parsedSign = false;
        if (sign !== 0) {
            parsedSign = true;
        }
        else {
            sign = 1;
        }
        position = ps.position;
        parselets_1.Parselets.parseDigitsInBase(ps, base);
        let value = parseInt(input.substring(initPos, ps.position), base);
        if (ps.position === position) {
            ps.kind = parsedSign ? reply_1.ReplyKind.HardFail : reply_1.ReplyKind.SoftFail;
        }
        else {
            ps.value = value;
            ps.kind = reply_1.ReplyKind.OK;
        }
    }
}
exports.PrsInt = PrsInt;
//# sourceMappingURL=int.js.map