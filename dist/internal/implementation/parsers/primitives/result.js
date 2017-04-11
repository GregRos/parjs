"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/parsers
 */ /** */
const action_1 = require("../../action");
const reply_1 = require("../../../../reply");
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
        ps.kind = reply_1.ReplyKind.OK;
    }
}
exports.PrsResult = PrsResult;

//# sourceMappingURL=result.js.map
