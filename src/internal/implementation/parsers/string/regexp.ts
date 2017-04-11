/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import {ParjsAction, ParjsBasicAction} from "../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
/**
 * Created by User on 24-Nov-16.
 */

export class PrsRegexp extends ParjsBasicAction {
    displayName = "regexp";
    expecting : string;
    constructor(private regexp : RegExp) {
        super();
        let flags = [regexp.ignoreCase && "i", regexp.multiline && "m"].filter(x => x).join("");
        let normalizedRegexp = new RegExp("^" + regexp.source, flags);
        regexp = normalizedRegexp;
        this.expecting = `input matching '${regexp.source}'`;
    }

    _apply(ps : ParsingState) {
        let {input, position} = ps;
        let {regexp} = this;
        input = input.substr(position);
        let match = regexp.exec(input);
        if (!match) {
            ps.kind = ReplyKind.SoftFail;
            return;
        }
        ps.position += match[0].length;
        let arr = match.slice(0);
        ps.value = arr;
        ps.kind = ReplyKind.OK;
    }
}