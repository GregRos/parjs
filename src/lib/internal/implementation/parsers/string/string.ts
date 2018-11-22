/**
 * @module parjs/internal/implementation/parsers
 */
/** */
import {ParjsBasicAction} from "../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";

/**
 * Created by User on 21-Nov-16.
 */
export class PrsString extends ParjsBasicAction {

    expecting: string;

    constructor(private _str: string) {
        super();
        this.expecting = `'${_str}'`;
    }

    _apply(ps: ParsingState) {
        let {_str} = this;
        let {position, input} = ps;
        let i;
        if (position + _str.length > input.length) {
            ps.kind = ReplyKind.SoftFail;
            return;
        }
        for (let i = 0; i < _str.length; i++, position++) {
            if (_str.charCodeAt(i) !== input.charCodeAt(position)) {
                ps.kind = ReplyKind.SoftFail;
                return;
            }
        }
        ps.position += _str.length;
        ps.value = _str;
        ps.kind = ReplyKind.Ok;
    }
}