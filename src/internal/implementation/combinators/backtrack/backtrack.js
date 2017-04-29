"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/combinators
 */ /** */
const action_1 = require("../../action");
class PrsBacktrack extends action_1.ParjsAction {
    constructor(inner) {
        super();
        this.inner = inner;
        this.isLoud = inner.isLoud;
        this.expecting = inner.expecting;
    }
    _apply(ps) {
        let { inner } = this;
        let { position } = ps;
        inner.apply(ps);
        if (ps.isOk) {
            //if inner succeeded, we backtrack.
            ps.position = position;
        }
        //whatever code ps had, we return it.
    }
}
exports.PrsBacktrack = PrsBacktrack;
//# sourceMappingURL=backtrack.js.map