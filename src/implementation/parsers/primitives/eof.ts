import {ParjsAction, ParjsBasicAction} from "../../../base/action";
import {QUIET_RESULT} from "../../common";
import {ParsingState} from "../../../abstract/basics/state";
import {ResultKind} from "../../../abstract/basics/result";
/**
 * Created by lifeg on 24/11/2016.
 */

export class PrsEof extends ParjsBasicAction {
    isLoud = false;
    displayName = "eof";
    expecting = "end of input";
    _apply(ps : ParsingState) {
        if (ps.position === ps.input.length) {
            ps.kind =  ResultKind.OK;
        } else {
            ps.kind = ResultKind.SoftFail;
        }
    }
}