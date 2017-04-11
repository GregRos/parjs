/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import {ParjsAction, ParjsBasicAction} from "../../action";
import {ReplyKind} from "../../../../reply";
import {ParsingState} from "../../state";
/**
 * Created by User on 22-Nov-16.
 */
export class PrsResult extends ParjsBasicAction {
    displayName ="result";
    isLoud = true;
    expecting = "anything";
    constructor(private result : any) {super()}
    _apply(ps : ParsingState) {
        let {result} = this;
        ps.value = result;
        ps.kind = ReplyKind.OK;
    }
}