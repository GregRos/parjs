/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import {ParjsAction, ParjsBasicAction} from "../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsString extends ParjsBasicAction  {

    expecting : string;
    constructor(private str : string) {
        super();
        this.expecting = `'${str}'`;
    }
    _apply(ps : ParsingState) {
        let {str} = this;
        let {position, input} = ps;
        let i;
        if (position + str.length > input.length) {
            ps.kind = ReplyKind.SoftFail;
            return;
        }
        for (let i = 0; i < str.length; i++, position++) {
            if (str.charCodeAt(i) !== input.charCodeAt(position)) {
                ps.kind = ReplyKind.SoftFail;
                return;
            }
        }
        ps.position += str.length;
        ps.value = str;
        ps.kind = ReplyKind.OK;
    }
}