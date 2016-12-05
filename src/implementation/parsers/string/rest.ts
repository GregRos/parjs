import {ParjsParserAction, ParjsBaseParserAction} from "../../../base/action";
/**
 * Created by User on 21-Nov-16.
 */

export class PrsRest extends ParjsBaseParserAction {
    displayName = "rest";
    isLoud = true;
    expecting = "zero or more characters";
    _apply(pr : ParsingState) {
        let {position, input} = pr;
        let text = input.substr(Math.min(position, input.length));
        pr.position = input.length;
        pr.value = text;
        pr.result = ResultKind.OK;
    }
}