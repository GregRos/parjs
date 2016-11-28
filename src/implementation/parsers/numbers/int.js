"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parser_action_1 = require("../../../base/parser-action");
var char_indicators_1 = require("../../../functions/char-indicators");
/**
 * Created by User on 28-Nov-16.
 */
/*
    Legal decimal integer format:
    (-|+)\d+
 */
var PrsInt = (function (_super) {
    __extends(PrsInt, _super);
    function PrsInt(signed, base) {
        _super.call(this);
        this.signed = signed;
        this.base = base;
        this.displayName = "int";
        this.isLoud = true;
        if (base > 36) {
            throw new Error("invalid base");
        }
    }
    PrsInt.prototype._apply = function (ps) {
        var _a = this, signed = _a.signed, base = _a.base;
        var position = ps.position, input = ps.input;
        var sign = 1;
        var maybeSign = input.charCodeAt(position);
        if (signed) {
            if (maybeSign === char_indicators_1.Codes.minus) {
                sign = -1;
                position++;
            }
            else if (maybeSign === char_indicators_1.Codes.plus) {
                position++;
            }
        }
        var num = 0;
        var factor = sign;
        for (; position < input.length; position++, factor *= 10) {
            var curCode = input.charCodeAt(position);
            if (char_indicators_1.Codes.isDigit(curCode, base)) {
                var value = char_indicators_1.Codes.digitValue(curCode);
                num += value * factor;
            }
            else {
                break;
            }
        }
        if (factor <= 1) {
            //this means the loop 'broke' on the first character.
            return false;
        }
        ps.position = position;
        ps.result = num;
        return true;
    };
    return PrsInt;
}(parser_action_1.JaseParserAction));
exports.PrsInt = PrsInt;
//# sourceMappingURL=int.js.map