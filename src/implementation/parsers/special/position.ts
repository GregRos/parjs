import {ParjsParserAction} from "../../../base/action";
/**
 * Created by User on 27-Nov-16.
 */

export class PrsPosition extends ParjsParserAction {
    displayName = "position";
    isLoud = true;
    expecting = "anything";
    _apply(ps : ParsingState) {
        ps.value = ps.position;
        ps.result = ResultKind.OK;
    }
}