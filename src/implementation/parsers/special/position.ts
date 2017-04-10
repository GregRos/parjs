import {ParjsAction} from "../../../base/action";
import {ParsingState} from "../../../abstract/basics/state";
import {ReplyKind} from "../../../abstract/basics/result";
/**
 * Created by User on 27-Nov-16.
 */

export class PrsPosition extends ParjsAction {
    displayName = "position";
    isLoud = true;
    expecting = "anything";
    _apply(ps : ParsingState) {
        ps.value = ps.position;
        ps.kind = ReplyKind.OK;
    }
}