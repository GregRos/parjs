import {JaseParserAction} from "../../../base/parser-action";
import {Issues} from "../../common";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsAlts extends JaseParserAction {
    isLoud : boolean;
    displayName = "alts";
    constructor(private alts : AnyParserAction[]) {
        super();
        if (alts.length === 0) {
            this.isLoud = false;
        } else {
            if (!alts.every(x => x.isLoud === alts[0].isLoud)) {
                Issues.mixedLoudnessNotPermitted(this);
            }
        }
        this.isLoud = alts.length === 0 ? false : alts.every(x => x.isLoud === alts[0].isLoud);
    }

    _apply(ps : ParsingState) {
        let {position} = ps;
        let {alts} = this;
        for (let i = 0; i < alts.length; i++) {
            //go over each alternative.
            let cur = alts[i];
            //apply it on the current state.
            if (cur.apply(ps)) {
                //if success, return true. The PS records the result.
                return true;
            } else {
                //backtrack to the original position and go to the next iteration.
                ps.position = position;
            }
        }
        return false;
    }
}
