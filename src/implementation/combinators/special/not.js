"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 22-Nov-16.
 */
var PrsNot = (function (_super) {
    __extends(PrsNot, _super);
    function PrsNot(inner) {
        _super.call(this);
        this.inner = inner;
        this.displayName = "not";
        this.isLoud = false;
        this.expecting = "not: " + inner.expecting;
    }
    ;
    PrsNot.prototype._apply = function (ps) {
        var inner = this.inner;
        var position = ps.position;
        inner.apply(ps);
        if (ps.isOk) {
            ps.position = position;
            ps.kind = result_1.ResultKind.SoftFail;
        }
        else if (ps.kind <= result_1.ResultKind.HardFail) {
            //hard fails are okay here
            ps.kind = result_1.ResultKind.OK;
            ps.position = position;
            return;
        }
        //the remaining case is a fatal failure that isn't recovered from.
    };
    return PrsNot;
}(action_1.ParjsAction));
exports.PrsNot = PrsNot;
//# sourceMappingURL=not.js.map