import {JaseParserAction} from "../../../base/parser-action";
import {Issues} from "../../common";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsSeqFunc extends JaseParserAction {
    isLoud = true;
    displayName = "seqFunc";
    constructor(private initial : AnyParserAction, private parserSelectors : ((result : any) => LoudParser<any>)[]) {
        super();
    }

    _apply(ps : ParsingState) {
        let {initial, parserSelectors} = this;
        let results = [];
        if (!initial.apply(ps)) {
            return false;
        }
        for (let i = 0; i < parserSelectors.length; i++) {
            let cur = parserSelectors[i];
            let prs = cur(ps.result);
            prs.isLoud || Issues.quietParserNotPermitted(this);
            if (prs.action) {
                results.maybePush(ps.result);
            } else {
                return false;
            }
        }
    }
}
