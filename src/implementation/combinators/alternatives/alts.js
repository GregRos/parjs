"use strict";
const action_1 = require("../../../base/action");
const common_1 = require("../../common");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
class PrsAlts extends action_1.ParjsAction {
    constructor(alts) {
        super();
        this.alts = alts;
        this.displayName = "alts";
        //if the list is empty, every won't execute and alts[0] won't be called.
        if (!alts.every(x => x.isLoud === alts[0].isLoud)) {
            common_1.Issues.mixedLoudnessNotPermitted(this);
        }
        this.isLoud = alts.every(x => x.isLoud === alts[0].isLoud);
        this.expecting = `any of: ${alts.join(", ")}`;
    }
    _apply(ps) {
        let { position } = ps;
        let { alts } = this;
        for (let i = 0; i < alts.length; i++) {
            //go over each alternative.
            let cur = alts[i];
            //apply it on the current state.
            cur.apply(ps);
            if (ps.isOk) {
                //if success, return. The PS records the result.
                return;
            }
            else if (ps.isSoft) {
                //backtrack to the original position and try again.
                ps.position = position;
            }
            else {
                //if failure, return false,
                return;
            }
        }
        ps.kind = result_1.ResultKind.SoftFail;
    }
}
exports.PrsAlts = PrsAlts;
//# sourceMappingURL=alts.js.map