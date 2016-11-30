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
    _apply(ps : ParsingState) : ResultKind {
        let {parsers} = this;
        let results = [];
        for (let i = 0; i < parsers.length; i++) {
            let cur = parsers[i];
            cur.apply(ps);
            if (ps.result.isOk) {
                results.maybePush(ps.value);
            } else if (ps.result.isSoft && i === 0) {
                return;
            } else if (ps.result.isSoft) {
                ps.result = ResultKind.HardFail;
                return;
            } else { //ps failed hard or fatally
                return;
            }
        }
        ps.value = results;
        ps.result = ResultKind.OK;

    }
}