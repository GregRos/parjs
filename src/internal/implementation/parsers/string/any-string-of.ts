/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import _ = require('lodash');
import {ParjsAction, ParjsBasicAction} from "../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
export class AnyStringOf extends ParjsBasicAction {
    displayName ="anyStringOf";
    isLoud = true;
    expecting : string;
    constructor(private strs : string[]) {
        super();
        this.expecting = `any of ${strs.map(x => `'${x}'`).join(", ",)}`;
    }

    _apply(ps : ParsingState) {
        let {position, input} = ps;
        let {strs} = this;
        strLoop:
        for (let i = 0; i < strs.length; i++) {
            let curStr = strs[i];
            if (input.length - position < curStr.length) continue;
            for (let j = 0; j < curStr.length; j++) {
                if (curStr.charCodeAt(j) !== input.charCodeAt(position + j)) {
                    continue strLoop;
                }
            }
            //this means we did not contiue strLoop so curStr passed our tests
            ps.position = position + curStr.length;
            ps.value = curStr;
            ps.kind = ReplyKind.OK;
            return;
        }
        ps.kind = ReplyKind.SoftFail;
    }
}