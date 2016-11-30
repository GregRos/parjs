import {JaseParserAction, JaseBaseParserAction} from "../../../base/parser-action";
/**
 * Created by User on 22-Nov-16.
 */
export class PrsStringLen extends JaseBaseParserAction{
    displayName = "stringLen";

    constructor(private length : number) {super()}

    _apply(ps : ParsingState) {
        let {position, input} = ps;
        let {length} = this;
        if (input.length < position + length) {
            ps.result = ResultKind.SoftFail;
            return;
        }
        ps.position += length;
        ps.value = input.substr(position, length);
        ps.result = ResultKind.OK;
    }
}