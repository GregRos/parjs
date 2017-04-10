import {ParjsAction} from "../../../base/action";
import {QUIET_RESULT} from "../../common";
import {AnyParserAction} from "../../../abstract/basics/action";
import {ReplyKind} from "../../../abstract/basics/result";
import {ParsingState} from "../../../abstract/basics/state";
/**
 * Created by User on 22-Nov-16.
 */
export class PrsNot extends ParjsAction {
    displayName = "not";
    isLoud = false;
    expecting : string;
    constructor(private inner : AnyParserAction) {
        super();
        this.expecting = `not: ${inner.expecting}`;
    };

    _apply(ps : ParsingState) {
        let {inner} = this;
        let {position} = ps;
        inner.apply(ps);
        if (ps.isOk) {
            ps.position = position;
            ps.kind = ReplyKind.SoftFail;
        }
        else if (ps.kind === ReplyKind.HardFail || ps.kind === ReplyKind.SoftFail) {
            //hard fails are okay here
            ps.kind = ReplyKind.OK;
            ps.position = position;
            return;
        }
        //the remaining case is a fatal failure that isn't recovered from.
    }
}