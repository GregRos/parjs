"use strict";
const action_1 = require("../../../base/action");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
class PrsCharWhere extends action_1.ParjsBasicAction {
    constructor(predicate, expecting = "(some property)") {
        super();
        this.predicate = predicate;
        this.displayName = "charWhere";
        this.isLoud = true;
        this.expecting = `a char matching: ${expecting}`;
    }
    _apply(ps) {
        let { predicate } = this;
        let { position, input } = ps;
        if (position >= input.length) {
            ps.kind = result_1.ResultKind.SoftFail;
            return;
        }
        let curChar = input[position];
        if (!predicate(curChar)) {
            ps.kind = result_1.ResultKind.SoftFail;
            return;
        }
        ps.value = curChar;
        ps.position++;
        ps.kind = result_1.ResultKind.OK;
    }
}
exports.PrsCharWhere = PrsCharWhere;

//# sourceMappingURL=char-where.js.map
