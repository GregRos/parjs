"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/parsers
 */ /** */
const action_1 = require("../../action");
const reply_1 = require("../../../../reply");
/**
 * Created by User on 27-Nov-16.
 */
class PrsState extends action_1.ParjsAction {
    constructor() {
        super(...arguments);
        this.isLoud = true;
        this.expecting = "anything";
    }
    _apply(ps) {
        ps.value = ps.userState;
        ps.kind = reply_1.ReplyKind.OK;
    }
}
exports.PrsState = PrsState;
//# sourceMappingURL=state.js.map