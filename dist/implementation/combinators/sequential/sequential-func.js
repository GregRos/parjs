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
var PrsSeqFunc = (function (_super) {
    __extends(PrsSeqFunc, _super);
    function PrsSeqFunc(initial, parserSelectors) {
        var _this = _super.call(this) || this;
        _this.initial = initial;
        _this.parserSelectors = parserSelectors;
        _this.isLoud = true;
        _this.displayName = "seqFunc";
        _this.expecting = initial.expecting;
        return _this;
    }
    PrsSeqFunc.prototype._apply = function (ps) {
        var _a = this, initial = _a.initial, parserSelectors = _a.parserSelectors;
        var results = [];
        initial.apply(ps);
        if (!ps.isOk) {
            //propagate the failure of 'initial' upwards.
            return;
        }
        for (var i = 0; i < parserSelectors.length; i++) {
            var cur = parserSelectors[i];
            var prs = cur(ps.value);
            prs.isLoud || common_1.Issues.quietParserNotPermitted(this);
            prs.action.apply(ps);
            if (ps.isOk) {
                results.maybePush(ps.value);
            }
            else if (ps.isSoft) {
                //at this point, even a soft failure becomes a hard one
                ps.kind = result_1.ResultKind.HardFail;
            }
            else {
                return;
            }
        }
        ps.value = results;
        return result_1.ResultKind.OK;
    };
    return PrsSeqFunc;
}(action_1.ParjsAction));
exports.PrsSeqFunc = PrsSeqFunc;

//# sourceMappingURL=sequential-func.js.map
