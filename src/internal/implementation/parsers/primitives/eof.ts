/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import {ParjsAction, ParjsBasicAction} from "../../action";
import {QUIET_RESULT} from "../../common";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
/**
 * Created by lifeg on 24/11/2016.
 */

export class PrsEof extends ParjsBasicAction {
    isLoud = false;
    displayName = "eof";
    expecting = "end of input";
    _apply(ps : ParsingState) {
        if (ps.position === ps.input.length) {
            ps.kind =  ReplyKind.OK;
        } else {
            ps.kind = ReplyKind.SoftFail;
        }
    }
}