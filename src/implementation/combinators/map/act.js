"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by lifeg on 02/04/2017.
 */
const action_1 = require("../../../base/action");
/**
 * Created by User on 21-Nov-16.
 */
class ActParser extends action_1.ParjsAction {
    constructor(inner, act) {
        super();
        this.inner = inner;
        this.act = act;
        this.displayName = "act";
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