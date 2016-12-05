import {JaseParserAction} from "../../../base/parser-action";
/**
 * Created by User on 27-Nov-16.
 */

export class PrsPosition extends JaseParserAction {
    displayName = "position";
    isLoud = true;
    expecting = "anything";
    _apply(ps : ParsingState) {
        ps.value = ps.position;
        ps.result = ResultKind.OK;
    }
}