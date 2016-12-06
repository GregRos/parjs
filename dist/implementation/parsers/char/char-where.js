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
var PrsCharWhere = (function (_super) {
    __extends(PrsCharWhere, _super);
    function PrsCharWhere(predicate, property) {
        if (property === void 0) { property = "(some property)"; }
        _super.call(this);
        this.predicate = predicate;
        this.displayName = "charWhere";
        this.isLoud = true;
        this.expecting = "any character satisfying " + property;
    }
    PrsCharWhere.prototype._apply = function (ps) {
        var predicate = this.predicate;
        var position = ps.position, input = ps.input;
        if (position >= input.length) {
            ps.result = ResultKind.SoftFail;
            return;
        }
        var curChar = input[position];
        if (!predicate(curChar)) {
            ps.result = ResultKind.SoftFail;
            return;
        }
        ps.value = curChar;
        ps.position++;
        ps.result = ResultKind.OK;
    };
    return PrsCharWhere;
}(action_1.ParjsBasicAction));
exports.PrsCharWhere = PrsCharWhere;

//# sourceMappingURL=char-where.js.map
