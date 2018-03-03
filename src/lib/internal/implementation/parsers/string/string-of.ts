/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import {ParjsBasicAction} from "../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
export class PrsStringOf extends ParjsBasicAction {

    isLoud = true;
    expecting : string;
    constructor(private _strs : string[]) {
        super();
        this.expecting = `any of ${_strs.map(x => `'${x}'`).join(", ",)}`;
    }

    _apply(ps : ParsingState) {
        let {position, input} = ps;
        let {_strs} = this;
        strLoop:
        for (let i = 0; i < _strs.length; i++) {
            let curStr = _strs[i];
            if (input.length - position < curStr.length) continue;
            for (let j = 0; j < curStr.length; j++) {
                if (curStr.charCodeAt(j) !== input.charCodeAt(position + j)) {
                    continue strLoop;
                }
            }
            //this means we did not contiue strLoop so curStr passed our tests
            ps.position = position + curStr.length;
            ps.value = curStr;
            ps.kind = ReplyKind.Ok;
            return;
        }
        ps.kind = ReplyKind.SoftFail;
    }
}