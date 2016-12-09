"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
var common_1 = require("../../common");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
var PrsManyTill = (function (_super) {
    __extends(PrsManyTill, _super);
    function PrsManyTill(many, till, tillOptional) {
        _super.call(this);
        this.many = many;
        this.till = till;
        this.tillOptional = tillOptional;
        this.displayName = "manyTill";
        this.isLoud = many.isLoud;
        this.expecting = many.expecting + " or " + till.expecting;
    }
    PrsManyTill.prototype._apply = function (ps) {
        var _a = this, many = _a.many, till = _a.till, tillOptional = _a.tillOptional;
        var position = ps.position;
        var arr = [];
        var successes = 0;
        while (true) {
            till.apply(ps);
            if (ps.isOk) {
                break;
            }
            else if (ps.kind >= result_1.ResultKind.HardFail) {
                //if till failed hard/fatally, we return the fail result.
                return;
            }
            //backtrack to before till failed.
            ps.position = position;
            many.apply(ps);
            if (ps.isOk) {
                arr.maybePush(ps.value);
            }
            else if (ps.isSoft) {
                //many failed softly before till...
                if (!tillOptional) {
                    //if we parsed at least one element, we fail hard.
                    ps.kind = successes === 0 ? result_1.ResultKind.SoftFail : result_1.ResultKind.HardFail;
                }
                else {
                    //till was optional, so many failing softly is OK.
                    break;
                }
            }
            else {
                //many failed hard/fatal
                return;
            }
            if (ps.position === position) {
                common_1.Issues.guardAgainstInfiniteLoop(this);
            }
            position = ps.position;
            successes++;
        }
        ps.value = arr;
        ps.kind = result_1.ResultKind.OK;
    };
    return PrsManyTill;
}(action_1.ParjsAction));
exports.PrsManyTill = PrsManyTill;

//# sourceMappingURL=manyTill.js.map
