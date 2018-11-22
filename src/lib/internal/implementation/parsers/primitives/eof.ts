/**
 * @module parjs/internal/implementation/parsers
 */
/** */
import {ParjsBasicAction} from "../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";

/**
 * Created by lifeg on 24/11/2016.
 */

export class PrsEof extends ParjsBasicAction {
    isLoud = false;

    expecting = "end of input";

    _apply(ps: ParsingState) {
        if (ps.position === ps.input.length) {
            ps.kind = ReplyKind.Ok;
        } else {
            ps.kind = ReplyKind.SoftFail;
        }
    }
}