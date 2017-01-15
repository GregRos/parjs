"use strict";
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var common_1 = require("../../common");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
var PrsManyTill = (function (_super) {
    tslib_1.__extends(PrsManyTill, _super);
    function PrsManyTill(many, till, tillOptional) {
        var _this = _super.call(this) || this;
        _this.many = many;
        _this.till = till;
        _this.tillOptional = tillOptional;
        _this.displayName = "manyTill";
        _this.isLoud = many.isLoud;
        _this.expecting = many.expecting + " or " + till.expecting;
        return _this;
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
                    return;
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
