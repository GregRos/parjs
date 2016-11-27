import {JaseParserAction, JaseBaseParserAction} from "../../../base/parser-action";
/**
 * Created by User on 21-Nov-16.
 */

export class PrsRest extends JaseBaseParserAction {
    displayName = "rest";
    isLoud = true;
    _apply(pr : ParsingState) {
        let {position, input} = pr;
        let text = input.substr(Math.min(position, input.length));
        pr.position = input.length;
        pr.result = text;
        return true;
    }
}