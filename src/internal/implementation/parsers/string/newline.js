"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation/parsers
 */ /** */
const action_1 = require("../../action");
const reply_1 = require("../../../../reply");
const char_info_1 = require("char-info");
const char_indicators_1 = require("../../functions/char-indicators");
/**
 * Created by User on 24-Nov-16.
 */
class PrsNewline extends action_1.ParjsAction {
    constructor(matchUnicode) {
        super();
        this.matchUnicode = matchUnicode;
        this.isLoud = true;
        this.expecting = matchUnicode ? "a unicode newline string" : "a newline string";
    }
    _apply(ps) {
        let { position, input } = ps;
        let { matchUnicode } = this;
        if (position >= input.length) {
            ps.kind = reply_1.ReplyKind.SoftFail;
            return;
        }
        let charAt = input.charCodeAt(position);
        if (charAt === char_indicators_1.Codes.newline) {
            ps.position++;
            ps.value = '\n';
            ps.kind = reply_1.ReplyKind.OK;
            return;
        }
        else if (charAt === char_indicators_1.Codes.carriageReturn) {
            position++;
            if (position < input.length && input.charCodeAt(position) === char_indicators_1.Codes.newline) {
                ps.position = position + 1;
                ps.value = '\r\n';
                ps.kind = reply_1.ReplyKind.OK;
                return;
            }
            ps.position = position;
            ps.value = '\r';
            ps.kind = reply_1.ReplyKind.OK;
            return;
        }
        else if (matchUnicode && char_info_1.CodeInfo.isUniNewline(charAt)) {
            ps.position++;
            ps.value = input.charAt(position);
            ps.kind = reply_1.ReplyKind.OK;
            return;
        }
        ps.kind = reply_1.ReplyKind.SoftFail;
    }
}
exports.PrsNewline = PrsNewline;
//# sourceMappingURL=newline.js.map