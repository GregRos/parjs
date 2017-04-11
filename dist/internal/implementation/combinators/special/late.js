"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/combinators
 */ /** */
const action_1 = require("../../action");
/**
 * Created by lifeg on 24/03/2017.
 */
class PrsLate extends action_1.ParjsAction {
    constructor(_resolver, isLoud) {
        super();
        this._resolver = _resolver;
        this.isLoud = isLoud;
        this.displayName = "late (unbound)";
    }
    ;
    _apply(ps) {
        if (!this._resolved) {
            this._resolved = this._resolver();
            this.expecting = this._resolved.expecting;
            this.displayName = `late ${this._resolved.displayName}`;
        }
        this._resolved.apply(ps);
    }
}
exports.PrsLate = PrsLate;

//# sourceMappingURL=late.js.map
