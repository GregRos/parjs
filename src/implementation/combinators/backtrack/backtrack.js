"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
/**
 * Created by User on 21-Nov-16.
 */
var PrsBacktrack = (function (_super) {
    __extends(PrsBacktrack, _super);
    function PrsBacktrack(inner) {
        _super.call(this);
        this.inner = inner;
        this.displayName = "backtrack";
        this.isLoud = inner.isLoud;
        this.expecting = inner.expecting;
    }
    PrsBacktrack.prototype._apply = function (ps) {
        var inner = this.inner;
        var position = ps.position;
        inner.apply(ps);
        if (ps.isOk) {
            //if inner succeeded, we backtrack.
            ps.position = position;
        }
        //whatever code ps had, we return it.
    };
    return PrsBacktrack;
}(action_1.ParjsParserAction));
exports.PrsBacktrack = PrsBacktrack;
//# sourceMappingURL=backtrack.js.map