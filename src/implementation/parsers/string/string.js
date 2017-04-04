"use strict";
const action_1 = require("../../../base/action");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
class PrsString extends action_1.ParjsBasicAction {
    constructor(str) {
        super();
        this.str = str;
        this.displayName = "string";
        this.expecting = `'${str}'`;
    }
    _apply(ps) {
        let { str } = this;
        let { position, input } = ps;
        let i;
        if (position + str.length > input.length) {
            ps.kind = result_1.ResultKind.SoftFail;
            return;
        }
        for (let i = 0; i < str.length; i++, position++) {
            if (str.charCodeAt(i) !== input.charCodeAt(position)) {
                ps.kind = result_1.ResultKind.SoftFail;
                return;
            }
        }
        ps.position += str.length;
        ps.value = str;
        ps.kind = result_1.ResultKind.OK;
    }
}
exports.PrsString = PrsString;
//# sourceMappingURL=string.js.map