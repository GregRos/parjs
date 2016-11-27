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
        if (input.length < position + length) return false;
        ps.position += length;
        ps.result = input.substr(position, length);
        return true;
    }
}