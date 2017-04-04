"use strict";
const action_1 = require("../../../base/action");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
class PrsRest extends action_1.ParjsBasicAction {
    constructor() {
        super(...arguments);
        this.displayName = "rest";
        this.isLoud = true;
        this.expecting = "zero or more characters";
    }
    _apply(pr) {
        let { position, input } = pr;
        let text = input.substr(Math.min(position, input.length));
        pr.position = input.length;
        pr.value = text;
        pr.kind = result_1.ResultKind.OK;
    }
}
exports.PrsRest = PrsRest;
//# sourceMappingURL=rest.js.map