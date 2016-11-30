import {JaseParserAction, JaseBaseParserAction, ResultKind} from "../../../base/parser-action";
/**
 * Created by User on 22-Nov-16.
 */
export class PrsResult extends JaseBaseParserAction {
    displayName ="result";
    isLoud = true;
    constructor(private result : any) {super()}
    _apply(ps : ParsingState) {
        let {result} = this;
        ps.value = result;
        ps.result = ResultKind.OK;
    }
}