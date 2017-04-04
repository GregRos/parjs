"use strict";
const action_1 = require("../../../base/action");
/**
 * Created by User on 21-Nov-16.
 */
class PrsWithState extends action_1.ParjsAction {
    constructor(inner, reducer) {
        super();
        this.inner = inner;
        this.reducer = reducer;
        this.displayName = "withState";
        this.isLoud = inner.isLoud;
        this.expecting = inner.expecting;
    }
    _apply(ps) {
        let { inner, reducer } = this;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.state = reducer(ps.state, ps.value);
    }
}
exports.PrsWithState = PrsWithState;

//# sourceMappingURL=with-state.js.map
