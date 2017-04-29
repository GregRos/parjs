"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/parsers
 */ /** */
const action_1 = require("../../action");
const reply_1 = require("../../../../reply");
/**
 * Created by User on 21-Nov-16.
 */
class PrsRest extends action_1.ParjsBasicAction {
    constructor() {
        super(...arguments);
        this.isLoud = true;
        this.expecting = "zero or more characters";
    }
    _apply(pr) {
        let { position, input } = pr;
        let text = input.substr(Math.min(position, input.length));
        pr.position = input.length;
        pr.value = text;
        pr.kind = reply_1.ReplyKind.OK;
    }
}
exports.PrsRest = PrsRest;

//# sourceMappingURL=rest.js.map
