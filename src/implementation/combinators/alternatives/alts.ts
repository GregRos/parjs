import {ParjsAction} from "../../../base/action";
import {Issues} from "../../common";
import {AnyParserAction} from "../../../abstract/basics/action";
import {ParsingState} from "../../../abstract/basics/state";
import {ResultKind} from "../../../abstract/basics/result";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsAlts extends ParjsAction {
    isLoud : boolean;
    displayName = "alts";
    expecting : string;
    constructor(private alts : AnyParserAction[]) {
        super();
        //if the list is empty, every won't execute and alts[0] won't be called.
        if (!alts.every(x => x.isLoud === alts[0].isLoud)) {
            Issues.mixedLoudnessNotPermitted(this);
        }
        this.isLoud = alts.every(x => x.isLoud === alts[0].isLoud);
        this.expecting = `any of: ${alts.join(", ")}`;
    }

    _apply(ps : ParsingState) {
        let {position} = ps;
        let {alts} = this;
        for (let i = 0; i < alts.length; i++) {
            //go over each alternative.
            let cur = alts[i];
            //apply it on the current state.
            cur.apply(ps);
            if (ps.isOk) {
                //if success, return. The PS records the result.
                return;
            } else if (ps.isSoft) {
                //backtrack to the original position and try again.
                ps.position = position;
            } else {
                //if failure, return false,
                return;
            }
        }
        ps.kind = ResultKind.SoftFail;
    }
}
