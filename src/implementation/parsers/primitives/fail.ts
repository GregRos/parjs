import {ParjsBasicAction} from "../../../base/action";
import {ResultKind} from "../../../abstract/basics/result";
import {ParsingState} from "../../../abstract/basics/state";
/**
 * Created by lifeg on 24/11/2016.
 */

export class PrsFail extends ParjsBasicAction {
    displayName = "fail";
    expecting = "no input";
    _apply(ps : ParsingState) {
        ps.kind =  ResultKind.SoftFail;
    }
}