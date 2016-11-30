import {JaseParserAction, ResultKind} from "../../../base/parser-action";
/**
 * Created by User on 27-Nov-16.
 */

export class PrsState extends JaseParserAction {
    displayName = "state";
    isLoud = true;
    _apply(ps : ParsingState) {
        ps.value = ps.state;
        ps.result = ResultKind.OK;
    }
}