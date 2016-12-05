import {ParjsParserAction} from "../../../base/action";
import {Codes, Chars} from "../../../functions/char-indicators";
/**
 * Created by User on 24-Nov-16.
 */

export class PrsNewline extends ParjsParserAction {
    displayName = "newline";
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
            ps.result = ResultKind.SoftFail;
            return;
        }
        let charAt = input.charCodeAt(position);

        if (matchUnicode && Codes.isUnicodeNewline(charAt)) {
            ps.position++;
            ps.value = input.charAt(position);
        }
        if (charAt === Codes.newline) {
            ps.position++;
            ps.value = '\n';
            ps.result = ResultKind.OK;
        } else if (charAt === Codes.carriageReturn) {
            position++;
            if (position < input.length && input.charCodeAt(position) === Codes.newline) {
                ps.position = position + 1;
                ps.value = '\r\n';
                ps.result = ResultKind.OK;
            }
            ps.position = position;
            ps.value = '\r';
            ps.result = ResultKind.OK;
        }
        ps.result = ResultKind.SoftFail;
    }
}