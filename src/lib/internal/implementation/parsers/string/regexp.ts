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

    expecting : string;
    constructor(private regexp : RegExp) {
        super();
        let flags = [regexp.ignoreCase && "i", regexp.multiline && "m"].filter(x => x).join("");
        let normalizedRegexp = new RegExp(regexp.source, flags + "y");
        regexp = normalizedRegexp;
        this.expecting = `input matching '${regexp.source}'`;
    }

    _apply(ps : ParsingState) {
        let {input, position} = ps;
        let {regexp} = this;
        regexp.lastIndex = position;
        let match = regexp.exec(input);
        if (!match) {
            ps.kind = ReplyKind.SoftFail;
            return;
        }
        ps.position += match[0].length;
        ps.value = match.slice();
        ps.kind = ReplyKind.OK;
    }
}