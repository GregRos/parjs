"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
/**
 * Created by User on 21-Nov-16.
 */
var PrsSeq = (function (_super) {
    __extends(PrsSeq, _super);
    function PrsSeq(parsers) {
        _super.call(this);
        this.parsers = parsers;
        this.isLoud = true;
        this.displayName = "seq";
    }
    PrsSeq.prototype._apply = function (ps) {
        var parsers = this.parsers;
        var results = [];
        for (var i = 0; i < parsers.length; i++) {
            var cur = parsers[i];
            cur.apply(ps);
            if (ps.result.isOk) {
                results.maybePush(ps.value);
            }
            else if (ps.result.isSoft && i === 0) {
                return;
            }
            else if (ps.result.isSoft) {
                ps.result = ResultKind.HardFail;
                return;
            }
            else {
                return;
            }
        }
        ps.value = results;
        ps.result = ResultKind.OK;
    };
    return PrsSeq;
}(parser_action_1.JaseParserAction));
exports.PrsSeq = PrsSeq;
//# sourceMappingURL=sequential.js.map