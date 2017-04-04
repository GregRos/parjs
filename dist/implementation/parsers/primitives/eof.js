"use strict";
const action_1 = require("../../../base/action");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by lifeg on 24/11/2016.
 */
class PrsEof extends action_1.ParjsBasicAction {
    constructor() {
        super(...arguments);
        this.isLoud = false;
        this.displayName = "eof";
        this.expecting = "end of input";
    }
    _apply(ps) {
        if (ps.position === ps.input.length) {
            ps.kind = result_1.ResultKind.OK;
        }
        else {
            ps.kind = result_1.ResultKind.SoftFail;
        }
    }
}
exports.PrsEof = PrsEof;

//# sourceMappingURL=eof.js.map
