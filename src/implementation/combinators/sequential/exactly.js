"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
/**
 * Created by User on 21-Nov-16.
 */
var PrsExactly = (function (_super) {
    __extends(PrsExactly, _super);
    function PrsExactly(inner, count) {
        _super.call(this);
        this.inner = inner;
        this.count = count;
        this.displayName = "exactly";
        this.isLoud = inner.isLoud;
        this.expecting = inner.expecting;
    }
    PrsExactly.prototype._apply = function (ps) {
        var _a = this, inner = _a.inner, count = _a.count, isLoud = _a.isLoud;
        var arr = [];
        for (var i = 0; i < count; i++) {
            inner.apply(ps);
            if (!ps.isOk) {
                //fail because the inner parser has failed.
                return;
            }
            arr.maybePush(ps.value);
        }
        ps.value = arr;
    };
    return PrsExactly;
}(parser_action_1.JaseParserAction));
exports.PrsExactly = PrsExactly;
//# sourceMappingURL=exactly.js.map