"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/combinators
 */ /** */
const action_1 = require("../../action");
const issues_1 = require("../../issues");
const reply_1 = require("../../../../reply");
const helpers_1 = require("../../functions/helpers");
/**
 * Created by User on 21-Nov-16.
 */
class PrsManySepBy extends action_1.ParjsAction {
    constructor(many, sep, maxIterations) {
        super();
        this.many = many;
        this.sep = sep;
        this.maxIterations = maxIterations;
        this.isLoud = many.isLoud;
        this.expecting = many.expecting;
    }
    _apply(ps) {
        let { many, sep, maxIterations, isLoud } = this;
        let arr = [];
        many.apply(ps);
        if (ps.atLeast(reply_1.ReplyKind.HardFail)) {
            return;
        }
        else if (ps.isSoft) {
            ps.value = [];
            ps.kind = reply_1.ReplyKind.OK;
            return;
        }
        let { position } = ps;
        helpers_1.ArrayHelpers.maybePush(arr, ps.value);
        let i = 1;
        while (true) {
            if (i >= maxIterations)
                break;
            sep.apply(ps);
            if (ps.isSoft) {
                break;
            }
            else if (ps.atLeast(reply_1.ReplyKind.HardFail)) {
                return;
            }
            many.apply(ps);
            if (ps.isSoft) {
                break;
            }
            else if (ps.atLeast(reply_1.ReplyKind.HardFail)) {
                return;
            }
            if (maxIterations >= Infinity && ps.position === position) {
                issues_1.Issues.guardAgainstInfiniteLoop("many");
            }
            helpers_1.ArrayHelpers.maybePush(arr, ps.value);
            position = ps.position;
            i++;
        }
        ps.kind = reply_1.ReplyKind.OK;
        ps.position = position;
        ps.value = arr;
        return;
    }
}
exports.PrsManySepBy = PrsManySepBy;

//# sourceMappingURL=manySepBy.js.map
