"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
/**
 * Created by lifeg on 24/11/2016.
 */
var PrsQuiet = (function (_super) {
    __extends(PrsQuiet, _super);
    function PrsQuiet(inner) {
        _super.call(this);
        this.inner = inner;
        this.displayName = "quiet";
        this.isLoud = false;
        this.expecting = inner.expecting;
    }
    PrsQuiet.prototype._apply = function (ps) {
        var inner = this.inner;
        inner.apply(ps);
    };
    return PrsQuiet;
}(action_1.ParjsAction));
exports.PrsQuiet = PrsQuiet;

//# sourceMappingURL=quiet.js.map
