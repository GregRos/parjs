"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/combinators
 */ /** */
const action_1 = require("../../action");
/**
 * Created by User on 21-Nov-16.
 */
class MapParser extends action_1.ParjsAction {
    constructor(inner, map) {
        super();
        this.inner = inner;
        this.map = map;
        this.isLoud = true;
        this.expecting = inner.expecting;
    }
    _apply(ps) {
        let { inner, map } = this;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.value = map(ps.value, ps.userState);
    }
}
exports.MapParser = MapParser;
//# sourceMappingURL=map.js.map