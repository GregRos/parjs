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
var PrsSeqFunc = (function (_super) {
    __extends(PrsSeqFunc, _super);
    function PrsSeqFunc(initial, parserSelectors) {
        _super.call(this);
        this.initial = initial;
        this.parserSelectors = parserSelectors;
        this.isLoud = true;
        this.displayName = "seqFunc";
    }
    PrsSeqFunc.prototype._apply = function (ps) {
        var _a = this, initial = _a.initial, parserSelectors = _a.parserSelectors;
        var results = [];
        if (!initial.apply(ps)) {
            return false;
        }
        for (var i = 0; i < parserSelectors.length; i++) {
            var cur = parserSelectors[i];
            var prs = cur(ps.result);
            prs.isLoud || common_1.Issues.quietParserNotPermitted(this);
            if (prs.action) {
                results.maybePush(ps.result);
            }
            else {
                return false;
            }
        }
    };
    return PrsSeqFunc;
}(parser_action_1.JaseParserAction));
exports.PrsSeqFunc = PrsSeqFunc;
//# sourceMappingURL=sequential-func.js.map