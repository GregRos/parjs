"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_1 = require("../../../base/action");
const result_1 = require("../../../abstract/basics/result");
const common_1 = require("../../common");
/**
 * Created by lifeg on 24/11/2016.
 */
class PrsFail extends action_1.ParjsBasicAction {
    constructor(kind, expecting) {
        super();
        this.kind = kind;
        this.expecting = expecting;
        this.displayName = "fail";
        [result_1.ReplyKind.OK, result_1.ReplyKind.Unknown].includes(kind) && common_1.Issues.expectedFailureKind(this);
    }
    _apply(ps) {
        ps.kind = this.kind;
        ps.expecting = this.expecting;
    }
}
exports.PrsFail = PrsFail;

//# sourceMappingURL=fail.js.map
