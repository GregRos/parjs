/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import {ParjsBasicAction} from "../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
/**
 * Created by User on 24-Nov-16.
 */

export class PrsRegexp extends ParjsBasicAction {

    expecting : string;
    constructor(private _regexp : RegExp) {
        super();
        let flags = [_regexp.ignoreCase && "i", _regexp.multiline && "m"].filter(x => x).join("");
        let normalizedRegexp = new RegExp(_regexp.source, `${flags}y`);
        _regexp = normalizedRegexp;
        this.expecting = `input matching '${_regexp.source}'`;
    }

    _apply(ps : ParsingState) {
        let {input, position} = ps;
        let {_regexp} = this;
        _regexp.lastIndex = position;
        let match = _regexp.exec(input);
        if (!match) {
            ps.kind = ReplyKind.SoftFail;
            return;
        }
        ps.position += match[0].length;
        ps.value = match.slice();
        ps.kind = ReplyKind.Ok;
    }
}