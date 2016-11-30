"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
var common_1 = require("../../common");
/**
 * Created by User on 21-Nov-16.
 */
var PrsAlts = (function (_super) {
    __extends(PrsAlts, _super);
    function PrsAlts(alts) {
        _super.call(this);
        this.alts = alts;
        this.displayName = "alts";
        if (alts.length === 0) {
            this.isLoud = false;
        }
        else {
            if (!alts.every(function (x) { return x.isLoud === alts[0].isLoud; })) {
                common_1.Issues.mixedLoudnessNotPermitted(this);
            }
        }
        this.isLoud = alts.length === 0 ? false : alts.every(function (x) { return x.isLoud === alts[0].isLoud; });
    }
    PrsAlts.prototype._apply = function (ps) {
        var position = ps.position;
        var alts = this.alts;
        for (var i = 0; i < alts.length; i++) {
            //go over each alternative.
            var cur = alts[i];
            //apply it on the current state.
            cur.apply(ps);
            if (ps.result.isOk) {
                //if success, return. The PS records the result.
                return;
            }
            else if (ps.result.isSoft) {
                //backtrack to the original position and try again.
                ps.position = position;
            }
            else {
                //if failure, return false,
                return;
            }
        }
        ps.result = ResultKind.SoftFail;
    };
    return PrsAlts;
}(parser_action_1.JaseParserAction));
exports.PrsAlts = PrsAlts;
//# sourceMappingURL=alts.js.map