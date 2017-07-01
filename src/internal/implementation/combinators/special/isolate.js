"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/combinators
 */ /** */
const action_1 = require("../../action");
const _ = require("lodash");
/**
 * Created by lifeg on 24/03/2017.
 */
class PrsIsolate extends action_1.ParjsAction {
    constructor(_inner) {
        super();
        this._inner = _inner;
        this.isLoud = true;
    }
    ;
    _apply(ps) {
        let state = ps.userState;
        ps.userState = _.cloneDeep(ps.initialUserState);
        this._inner.apply(ps);
        ps.userState = state;
    }
}
exports.PrsIsolate = PrsIsolate;
//# sourceMappingURL=isolate.js.map