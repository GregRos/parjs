"use strict";
const action_1 = require("../../../base/action");
/**
 * Created by lifeg on 24/03/2017.
 */
class PrsLate extends action_1.ParjsAction {
    constructor(_resolver) {
        super();
        this._resolver = _resolver;
        this.displayName = "late (unbound)";
        this.isLoud = false;
    }
    ;
    _apply(ps) {
        if (!this._resolved) {
            this._resolved = this._resolver();
            this.expecting = this._resolved.expecting;
            this.displayName = `late ${this._resolved.displayName}`;
        }
        return this._resolved.apply(ps);
    }
}
exports.PrsLate = PrsLate;

//# sourceMappingURL=late.js.map
