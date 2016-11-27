import {JaseParserAction} from "../../../base/parser-action";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsSeq extends JaseParserAction {
    isLoud = true;
    displayName = "seq";
    constructor(private parsers : AnyParserAction[]) {
        super();
    }
    _apply(ps : ParsingState) {
        let {parsers} = this;
        let results = [];
        for (let i = 0; i < parsers.length; i++) {
            let cur = parsers[i];
            if (cur.apply(ps)) {
                results.maybePush(ps.result);
            } else {
                return false;
            }
        }
        ps.result = results;
        return true;
    }
}