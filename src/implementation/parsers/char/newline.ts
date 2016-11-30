import {JaseParserAction} from "../../../base/parser-action";
import {Codes, Chars} from "../../../functions/char-indicators";
/**
 * Created by User on 24-Nov-16.
 */

export class PrsNewline extends JaseParserAction {
    displayName = "newline";
    isLoud = true;
    constructor(private matchUnicode : boolean) {
        super();
    }
    _apply(ps : ParsingState) {
        let {position, input} = ps;
        let {matchUnicode} = this;
        if (position >= input.length) return false;
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