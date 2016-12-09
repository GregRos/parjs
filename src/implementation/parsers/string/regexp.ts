import {ParjsAction, ParjsBasicAction} from "../../../base/action";
import {ParsingState} from "../../../abstract/basics/state";
import {ResultKind} from "../../../abstract/basics/result";
/**
 * Created by User on 24-Nov-16.
 */

export class PrsRegexp extends ParjsBasicAction {
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
            ps.kind = ResultKind.SoftFail;
            return;
        }
        ps.position = regexp.lastIndex;
        let arr = match.slice();
        ps.value = arr;
        ps.kind = ResultKind.OK;
    }
}