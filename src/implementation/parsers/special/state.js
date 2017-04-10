"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_1 = require("../../../base/action");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 27-Nov-16.
 */
class PrsState extends action_1.ParjsAction {
    constructor() {
        super(...arguments);
        this.displayName = "state";
        this.isLoud = true;
        this.expecting = "anything";
    }
    _apply(ps) {
        ps.value = ps.state;
        ps.kind = result_1.ReplyKind.OK;
    }
}
exports.PrsState = PrsState;
//# sourceMappingURL=state.js.map