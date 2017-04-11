"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_1 = require("../../action");
/**
 * Created by lifeg on 24/11/2016.
 */
class PrsQuiet extends action_1.ParjsAction {
    constructor(inner) {
        super();
        this.inner = inner;
        this.displayName = "quiet";
        this.isLoud = false;
        this.expecting = inner.expecting;
    }
    _apply(ps) {
        let { inner } = this;
        inner.apply(ps);
    }
}
exports.PrsQuiet = PrsQuiet;
//# sourceMappingURL=quiet.js.map