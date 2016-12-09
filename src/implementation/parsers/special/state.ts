import {ParjsAction} from "../../../base/action";
import {ParsingState} from "../../../abstract/basics/state";
import {ResultKind} from "../../../abstract/basics/result";
/**
 * Created by User on 27-Nov-16.
 */

export class PrsState extends ParjsAction {
    displayName = "state";
    isLoud = true;
    expecting = "anything";
    _apply(ps : ParsingState) {
        ps.value = ps.state;
        ps.kind = ResultKind.OK;
    }
}