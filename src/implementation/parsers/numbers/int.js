"use strict";
const action_1 = require("../../../base/action");
const parselets_1 = require("./parselets");
const result_1 = require("../../../abstract/basics/result");
class PrsInt extends action_1.ParjsAction {
    constructor(options) {
        super();
        this.options = options;
        this.displayName = "int";
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
            ps.kind = parsedSign ? result_1.ResultKind.HardFail : result_1.ResultKind.SoftFail;
        }
        else {
            ps.value = value;
            ps.kind = result_1.ResultKind.OK;
        }
    }
}
exports.PrsInt = PrsInt;
//# sourceMappingURL=int.js.map