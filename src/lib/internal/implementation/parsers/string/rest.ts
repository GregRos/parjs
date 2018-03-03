/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import {ParjsBasicAction} from "../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
/**
 * Created by User on 21-Nov-16.
 */

export class PrsRest extends ParjsBasicAction {

    isLoud = true;
    expecting = "zero or more characters";
    _apply(pr : ParsingState) {
        let {position, input} = pr;
        let text = input.substr(Math.min(position, input.length));
        pr.position = input.length;
        pr.value = text;
        pr.kind = ReplyKind.Ok;
    }
}