"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_1 = require("../../../base/action");
const result_1 = require("../../../abstract/basics/result");
class AnyStringOf extends action_1.ParjsBasicAction {
    constructor(strs) {
        super();
        this.strs = strs;
        this.displayName = "anyStringOf";
        this.isLoud = true;
        this.expecting = `any of ${strs.map(x => `'${x}'`).join(", ")}`;
    }
    _apply(ps) {
        let { position, input } = ps;
        let { strs } = this;
        strLoop: for (let i = 0; i < strs.length; i++) {
            let curStr = strs[i];
            if (input.length - position < curStr.length)
                continue;
            for (let j = 0; j < curStr.length; j++) {
                if (curStr.charCodeAt(j) !== input.charCodeAt(position + j)) {
                    continue strLoop;
                }
            }
            //this means we did not contiue strLoop so curStr passed our tests
            ps.position = position + curStr.length;
            ps.value = curStr;
            ps.kind = result_1.ReplyKind.OK;
            return;
        }
        ps.kind = result_1.ReplyKind.SoftFail;
    }
}
exports.AnyStringOf = AnyStringOf;

//# sourceMappingURL=any-string-of.js.map
