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
        var _this = _super.call(this) || this;
        _this.inner = inner;
        _this.displayName = "quiet";
        _this.isLoud = false;
        _this.expecting = inner.expecting;
        return _this;
    }
    PrsQuiet.prototype._apply = function (ps) {
        var inner = this.inner;
        inner.apply(ps);
    };
    return PrsQuiet;
}(action_1.ParjsAction));
exports.PrsQuiet = PrsQuiet;
//# sourceMappingURL=quiet.js.map