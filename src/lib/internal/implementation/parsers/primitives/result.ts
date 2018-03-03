/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import {ParjsBasicAction} from "../../action";
import {ReplyKind} from "../../../../reply";
import {ParsingState} from "../../state";
/**
 * Created by User on 22-Nov-16.
 */
export class PrsResult extends ParjsBasicAction {

    isLoud = true;
    expecting = "anything";
    constructor(private _result : any) {super()}
    _apply(ps : ParsingState) {
        let {_result} = this;
        ps.value = _result;
        ps.kind = ReplyKind.Ok;
    }
}