"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
var parselets_1 = require("./parselets");
var result_1 = require("../../../abstract/basics/result");
var PrsInt = (function (_super) {
    __extends(PrsInt, _super);
    function PrsInt(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.displayName = "int";
        _this.isLoud = true;
        if (options.base > 36) {
            throw new Error("invalid base");
        }
        _this.expecting = "a " + (options.allowSign ? "signed" : "unsigned") + " integer in base " + options.base;
        return _this;
    }
    PrsInt.prototype._apply = function (ps) {
        var _a = this.options, allowSign = _a.allowSign, base = _a.base;
        var position = ps.position, input = ps.input;
        var initPos = ps.position;
        var sign = allowSign ? parselets_1.Parselets.parseSign(ps) : 0;
        var parsedSign = false;
        if (sign !== 0) {
            parsedSign = true;
        }
        else {
            sign = 1;
        }
        position = ps.position;
        parselets_1.Parselets.parseDigitsInBase(ps, base);
        var value = parseInt(input.substring(initPos, ps.position), base);
        if (ps.position === position) {
            ps.kind = parsedSign ? result_1.ResultKind.HardFail : result_1.ResultKind.SoftFail;
        }
        else {
            ps.value = value;
            ps.kind = result_1.ResultKind.OK;
        }
    };
    return PrsInt;
}(action_1.ParjsAction));
exports.PrsInt = PrsInt;

//# sourceMappingURL=int.js.map
