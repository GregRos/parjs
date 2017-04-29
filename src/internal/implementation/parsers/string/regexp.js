"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/parsers
 */ /** */
const action_1 = require("../../action");
const reply_1 = require("../../../../reply");
/**
 * Created by User on 24-Nov-16.
 */
class PrsRegexp extends action_1.ParjsBasicAction {
    constructor(regexp) {
        super();
        this.regexp = regexp;
        let flags = [regexp.ignoreCase && "i", regexp.multiline && "m"].filter(x => x).join("");
        let normalizedRegexp = new RegExp("^" + regexp.source, flags);
        regexp = normalizedRegexp;
        this.expecting = `input matching '${regexp.source}'`;
    }
    _apply(ps) {
        let { input, position } = ps;
        let { regexp } = this;
        input = input.substr(position);
        let match = regexp.exec(input);
        if (!match) {
            ps.kind = reply_1.ReplyKind.SoftFail;
            return;
        }
        ps.position += match[0].length;
        let arr = match.slice(0);
        ps.value = arr;
        ps.kind = reply_1.ReplyKind.OK;
    }
}
exports.PrsRegexp = PrsRegexp;
//# sourceMappingURL=regexp.js.map