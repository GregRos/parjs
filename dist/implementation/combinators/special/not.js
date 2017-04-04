"use strict";
const action_1 = require("../../../base/action");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 22-Nov-16.
 */
class PrsNot extends action_1.ParjsAction {
    constructor(inner) {
        super();
        this.inner = inner;
        this.displayName = "not";
        this.isLoud = false;
        this.expecting = `not: ${inner.expecting}`;
    }
    ;
    _apply(ps) {
        let { inner } = this;
        let { position } = ps;
        inner.apply(ps);
        if (ps.isOk) {
            ps.position = position;
            ps.kind = result_1.ResultKind.SoftFail;
        }
        else if (ps.kind === result_1.ResultKind.HardFail || ps.kind === result_1.ResultKind.SoftFail) {
            //hard fails are okay here
            ps.kind = result_1.ResultKind.OK;
            ps.position = position;
            return;
        }
        //the remaining case is a fatal failure that isn't recovered from.
    }
}
exports.PrsNot = PrsNot;

//# sourceMappingURL=not.js.map
