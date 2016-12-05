import {ParjsParserAction} from "../../../base/action";
import {Issues} from "../../common";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsSeqFunc extends ParjsParserAction {
    isLoud = true;
    displayName = "seqFunc";
    expecting : string;
    constructor(private initial : AnyParserAction, private parserSelectors : ((result : any) => LoudParser<any>)[]) {
        super();
        this.expecting = initial.expecting;
    }

    _apply(ps : ParsingState) {
        let {initial, parserSelectors} = this;
        let results = [];
        initial.apply(ps);
        if (!ps.isOk) {
            //propagate the failure of 'initial' upwards.
            return;
        }
        for (let i = 0; i < parserSelectors.length; i++) {
            let cur = parserSelectors[i];
            let prs = cur(ps.value);
            prs.isLoud || Issues.quietParserNotPermitted(this);
            prs.action.apply(ps);
            if (ps.isOk) {
                results.maybePush(ps.value);
            } else if (ps.isSoft) {
                //at this point, even a soft failure becomes a hard one
                ps.result = ResultKind.HardFail;
            } else {
                return;
            }
        }
        ps.value = results;
        return ResultKind.OK;
    }
}
