"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/combinators
 */ /** */
const action_1 = require("../../action");
class ActParser extends action_1.ParjsAction {
    constructor(inner, act) {
        super();
        this.inner = inner;
        this.act = act;
        this.expecting = inner.expecting;
    }
    get isLoud() {
        return this.inner.isLoud;
    }
    _apply(ps) {
        let { inner, act } = this;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        act(ps.value, ps.state);
    }
}
exports.ActParser = ActParser;

//# sourceMappingURL=act.js.map
