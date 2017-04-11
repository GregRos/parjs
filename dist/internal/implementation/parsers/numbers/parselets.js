"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const char_indicators_1 = require("../../functions/char-indicators");
/**
 * Created by User on 29-Nov-16.
 */
class _ParseletsType {
    parseDigitsInBase(ps, base) {
        let { position, input } = ps;
        let length = input.length;
        let result = 0;
        for (; position < length; position++) {
            let curCode = input.charCodeAt(position);
            if (!char_indicators_1.Codes.isDigit(curCode, base)) {
                break;
            }
        }
        ps.position = position;
        return result;
    }
    /**
     * Tries to parse a '+' or '-'. Returns the sign that was parsed, or 0 if the parsing failed.
     * @param ps
     * @returns {number}
     */
    parseSign(ps) {
        let sign = 0;
        let curChar = ps.input.charCodeAt(ps.position);
        if (curChar === char_indicators_1.Codes.minus) {
            sign = -1;
            ps.position++;
        }
        else if (curChar === char_indicators_1.Codes.plus) {
            ps.position++;
            sign = 1;
        }
        return sign;
    }
}
exports._ParseletsType = _ParseletsType;
exports.Parselets = new _ParseletsType();

//# sourceMappingURL=parselets.js.map
