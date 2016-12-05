import {ParjsParserAction, ParjsBaseParserAction} from "../../../base/action";
/**
 * Created by User on 24-Nov-16.
 */

export class PrsRegexp extends ParjsBaseParserAction {
    displayName = "regexp";
    expecting : string;
    constructor(private regexp : RegExp) {
        super();
        let flags = [regexp.ignoreCase && "i", regexp.multiline && "m"].filter(x => x).join("");
        let normalizedRegexp = new RegExp(regexp.source, flags);
        regexp = normalizedRegexp;
        this.expecting = `input matching '${regexp.source}'`;
    }

    _apply(ps : ParsingState) {
        let {input, position} = ps;
        let {regexp} = this;
        input = input.substr(position);
        let match = regexp.exec(input);
        if (!match) {
            ps.result = ResultKind.SoftFail;
            return;
        }
        ps.position = regexp.lastIndex;
        let arr = match.slice();
        ps.value = arr;
        ps.result = ResultKind.OK;
    }
}