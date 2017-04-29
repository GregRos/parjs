"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/combinators
 */ /** */
const special_results_1 = require("../../special-results");
const action_1 = require("../../action");
const helpers_1 = require("../../functions/helpers");
/**
 * Created by User on 21-Nov-16.
 */
class PrsStr extends action_1.ParjsAction {
    constructor(inner) {
        super();
        this.inner = inner;
        this.isLoud = true;
        this.expecting = inner.expecting;
    }
    _apply(ps) {
        let { inner } = this;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        let { value } = ps;
        let typeStr = typeof value;
        if (typeStr === "string") {
        }
        else if (value === special_results_1.QUIET_RESULT) {
            ps.value = "";
        }
        else if (value === null || value === undefined) {
            ps.value = String(value);
        }
        else if (value instanceof Array) {
            ps.value = helpers_1.StringHelpers.recJoin(value);
        }
        else if (typeStr === "symbol") {
            ps.value = String(value).slice(7, -1);
        }
        else {
            ps.value = value.toString();
        }
    }
}
exports.PrsStr = PrsStr;

//# sourceMappingURL=str.js.map
