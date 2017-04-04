"use strict";
const action_1 = require("../../../base/action");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 24-Nov-16.
 */
class PrsRegexp extends action_1.ParjsBasicAction {
    constructor(regexp) {
        super();
        this.regexp = regexp;
        this.displayName = "regexp";
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
            ps.kind = result_1.ResultKind.SoftFail;
            return;
        }
        ps.position += match[0].length;
        let arr = match.slice(0);
        ps.value = arr;
        ps.kind = result_1.ResultKind.OK;
    }
}
exports.PrsRegexp = PrsRegexp;
//# sourceMappingURL=regexp.js.map