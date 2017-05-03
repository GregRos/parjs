/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import {ParjsAction} from "../../action";
import {ReplyKind} from "../../../../reply";
import {ParsingState} from "../../state";
import {CodeInfo} from "char-info";
import {Codes} from "../../functions/char-indicators";
/**
 * Created by User on 24-Nov-16.
 */

export class PrsNewline extends ParjsAction {

    isLoud = true;
    expecting : string;
    constructor(private matchUnicode : boolean) {
        super();
        this.expecting = matchUnicode ? "a unicode newline string" : "a newline string";
    }
    _apply(ps : ParsingState) {
        let {position, input} = ps;
        let {matchUnicode} = this;
        if (position >= input.length) {
            ps.kind = ReplyKind.SoftFail;
            return;
        }
        let charAt = input.charCodeAt(position);

        if (charAt === Codes.newline) {
            ps.position++;
            ps.value = '\n';
            ps.kind = ReplyKind.OK;
            return;
        } else if (charAt === Codes.carriageReturn) {
            position++;
            if (position < input.length && input.charCodeAt(position) === Codes.newline) {
                ps.position = position + 1;
                ps.value = '\r\n';
                ps.kind = ReplyKind.OK;
                return;
            }
            ps.position = position;
            ps.value = '\r';
            ps.kind = ReplyKind.OK;
            return;
        } else if (matchUnicode && CodeInfo.isUniNewline(charAt)) {
            ps.position++;
            ps.value = input.charAt(position);
            ps.kind = ReplyKind.OK;
            return;
        }
        ps.kind = ReplyKind.SoftFail;
    }
}