"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
var PrsSeq = (function (_super) {
    tslib_1.__extends(PrsSeq, _super);
    function PrsSeq(parsers) {
        var _this = _super.call(this) || this;
        _this.parsers = parsers;
        _this.isLoud = true;
        _this.displayName = "seq";
        if (parsers.length === 0) {
            _this.expecting = "anything";
        }
        else {
            _this.expecting = parsers[0].expecting;
        }
        return _this;
    }
    PrsSeq.prototype._apply = function (ps) {
        var parsers = this.parsers;
        var results = [];
        for (var i = 0; i < parsers.length; i++) {
            var cur = parsers[i];
            cur.apply(ps);
            if (ps.isOk) {
                results.maybePush(ps.value);
            }
            else if (ps.isSoft && i === 0) {
                //if the first parser failed softly then we propagate a soft failure.
                return;
            }
            else if (ps.isSoft) {
                ps.kind = result_1.ResultKind.HardFail;
                //if a i > 0 parser failed softly, this is a hard fail for us.
                //also, propagate the internal expectation.
                return;
            }
            else {
                //ps failed hard or fatally. The same severity.
                return;
            }
        }
        ps.value = results;
        ps.kind = result_1.ResultKind.OK;
    };
    return PrsSeq;
}(action_1.ParjsAction));
exports.PrsSeq = PrsSeq;
//# sourceMappingURL=sequential.js.map