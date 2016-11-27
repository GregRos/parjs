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

        if (matchUnicode && Chars.isUnicodeNewline(charAt)) {
            ps.position++;
            ps.result = input.charAt(position);
        }
        if (charAt === Codes.newline) {
            ps.position++;
            ps.result = '\n';
            return true;
        } else if (charAt === Codes.carriageReturn) {
            position++;
            if (position < input.length && input.charCodeAt(position) === Codes.newline) {
                ps.position = position + 1;
                ps.result = '\r\n';
                return true;
            }
            ps.position = position;
            ps.result = '\r';
            return true;
        }
    }
}