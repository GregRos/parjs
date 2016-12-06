/**
 * Created by User on 22-Nov-16.
 */
import _ = require('lodash');
import {ParjsAction, ParjsBasicAction} from "../../../base/action";
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
            ps.result = ResultKind.OK;
            return;
        }
        ps.result = ResultKind.SoftFail;
    }
}