import {ParjsParserAction} from "../../../base/action";
/**
 * Created by User on 27-Nov-16.
 */

export class PrsState extends ParjsParserAction {
    displayName = "state";
    isLoud = true;
    expecting = "anything";
    _apply(ps : ParsingState) {
        ps.value = ps.state;
        ps.result = ResultKind.OK;
    }
}