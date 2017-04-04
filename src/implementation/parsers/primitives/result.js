"use strict";
const action_1 = require("../../../base/action");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 22-Nov-16.
 */
class PrsResult extends action_1.ParjsBasicAction {
    constructor(result) {
        super();
        this.result = result;
        this.displayName = "result";
        this.isLoud = true;
        this.expecting = "anything";
    }
    _apply(ps) {
        let { result } = this;
        ps.value = result;
        ps.kind = result_1.ResultKind.OK;
    }
}
exports.PrsResult = PrsResult;
//# sourceMappingURL=result.js.map