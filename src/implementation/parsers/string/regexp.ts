import {JaseParserAction, JaseBaseParserAction} from "../../../base/parser-action";
/**
 * Created by User on 24-Nov-16.
 */

export class PrsRegexp extends JaseBaseParserAction {
    displayName = "regexp";
    constructor(private regexp : RegExp) {
        super();
        let flags = regexp.flags.replace(/(g|y)/i, "");
        let normalizedRegexp = new RegExp(regexp.source, flags);
        regexp = normalizedRegexp;
    }

    _apply(ps : ParsingState) {
        let {input, position} = ps;
        let {regexp} = this;
        input = input.substr(position);
        let match = regexp.exec(input);
        if (!match) {
            return false;
        }
        ps.position = regexp.lastIndex;
        let arr = match.slice();
        ps.result = arr;
        return true;
    }
}