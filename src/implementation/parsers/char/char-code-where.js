"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 24-Nov-16.
 */
var PrsCharCodeWhere = (function (_super) {
    tslib_1.__extends(PrsCharCodeWhere, _super);
    function PrsCharCodeWhere(predicate, property) {
        if (property === void 0) { property = "(a specific property)"; }
        var _this = _super.call(this) || this;
        _this.predicate = predicate;
        _this.displayName = "charCodeWhere";
        _this.isLoud = true;
        _this.expecting = "any character satisfying " + property + ".";
        return _this;
    }
    PrsCharCodeWhere.prototype._apply = function (ps) {
        var predicate = this.predicate;
        var position = ps.position, input = ps.input;
        if (position >= input.length) {
            ps.kind = result_1.ResultKind.SoftFail;
            return;
        }
        var curChar = input.charCodeAt(position);
        if (!predicate(curChar)) {
            ps.kind = result_1.ResultKind.SoftFail;
            return;
        }
        ps.value = String.fromCharCode(curChar);
        ps.position++;
        ps.kind = result_1.ResultKind.OK;
    };
    return PrsCharCodeWhere;
}(action_1.ParjsBasicAction));
exports.PrsCharCodeWhere = PrsCharCodeWhere;
//# sourceMappingURL=char-code-where.js.map