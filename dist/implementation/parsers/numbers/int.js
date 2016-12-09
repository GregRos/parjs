"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
var parselets_1 = require('./parselets');
var math_1 = require("../../../functions/math");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 28-Nov-16.
 */
/*
    Legal decimal integer format:
    (-|+)\d+
 */
var PrsInt = (function (_super) {
    __extends(PrsInt, _super);
    function PrsInt(signed, base) {
        _super.call(this);
        this.signed = signed;
        this.base = base;
        this.displayName = "int";
        this.isLoud = true;
        if (base > 36) {
            throw new Error("invalid base");
        }
        this.expecting = "a " + (signed ? "signed" : "unsigned") + " integer in base " + base;
    }
    PrsInt.prototype._apply = function (ps) {
        var _a = this, signed = _a.signed, base = _a.base;
        var position = ps.position, input = ps.input;
        var sign = parselets_1.Parselets.parseSign(ps);
        sign = sign === 0 ? 1 : sign;
        var value = parselets_1.Parselets.parseDigits(ps, base, math_1.FastMath.PositiveExponents);
        ps.position = position;
        ps.value = value;
        ps.kind = result_1.ResultKind.OK;
        return;
    };
    return PrsInt;
}(action_1.ParjsAction));
exports.PrsInt = PrsInt;

//# sourceMappingURL=int.js.map
