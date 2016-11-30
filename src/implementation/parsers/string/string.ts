import {JaseParserAction, JaseBaseParserAction} from "../../../base/parser-action";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsString extends JaseBaseParserAction  {
    displayName = "string";
    constructor(private str : string) {super()}
    _apply(ps : ParsingState) : boolean {
        let {str} = this;
        let {position, input} = ps;
        let i;
        if (position + str.length > input.length) return false;
        for (let i = 0; i < str.length; i++, position++) {
            if (str.charCodeAt(i) !== input.charCodeAt(position)) {
                ps.result = ResultKind.SoftFail;
                return;
            }
        }
        ps.position += str.length;
        ps.value = str;
        ps.result = ResultKind.OK;
    }
}