/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import {ParjsAction, ParjsBasicAction} from "../../action";
import {QUIET_RESULT} from "../../special-results";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
/**
 * Created by lifeg on 24/11/2016.
 */

export class PrsEof extends ParjsBasicAction {
    isLoud = false;

    expecting = "end of input";
    _apply(ps : ParsingState) {
        if (ps.position === ps.input.length) {
            ps.kind =  ReplyKind.OK;
        } else {
            ps.kind = ReplyKind.SoftFail;
        }
    }
}