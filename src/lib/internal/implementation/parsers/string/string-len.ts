/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import {ParjsBasicAction} from "../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
/**
 * Created by User on 22-Nov-16.
 */
export class PrsStringLen extends ParjsBasicAction{

    expecting : string;

    constructor(private _length : number) {
       super();
       this.expecting = `${_length} characters`;
    }

    _apply(ps : ParsingState) {
        let {position, input} = ps;
        let {_length} = this;
        if (input.length < position + _length) {
            ps.kind = ReplyKind.SoftFail;
            return;
        }
        ps.position += _length;
        ps.value = input.substr(position, _length);
        ps.kind = ReplyKind.Ok;
    }
}