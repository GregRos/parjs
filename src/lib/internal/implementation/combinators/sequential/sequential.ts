/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {ReplyKind} from "../../../../reply";
import {ParsingState} from "../../state";
import {AnyParserAction} from "../../../action";
import {ArrayHelpers} from "../../functions/helpers";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsSeq extends ParjsAction {
    isLoud = true;

    expecting : string;
    constructor(private parsers : AnyParserAction[]) {
        super();
        if (parsers.length === 0) {
            this.expecting = "anything";
        } else {
            this.expecting = parsers[0].expecting;
        }
    }
    _apply(ps : ParsingState) : ReplyKind {
        let {parsers} = this;
        let results = [];
        let origPos = ps.position;
        for (let i = 0; i < parsers.length; i++) {
            let cur = parsers[i];
            cur.apply(ps);
            if (ps.isOk) {
                ArrayHelpers.maybePush(results, ps.value);
            } else if (ps.isSoft && origPos === ps.position) {
                //if the first parser failed softly then we propagate a soft failure.
                return;
            } else if (ps.isSoft) {
                ps.kind = ReplyKind.HardFail;
                //if a i > 0 parser failed softly, this is a hard fail for us.
                //also, propagate the internal expectation.
                return;
            } else {
                //ps failed hard or fatally. The same severity.
                return;
            }
        }
        ps.value = results;
        ps.kind = ReplyKind.OK;

    }
}