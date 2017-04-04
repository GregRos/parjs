import {ParjsBasicAction} from "../../../base/action";
import {ResultKind} from "../../../abstract/basics/result";
import {ParsingState} from "../../../abstract/basics/state";
import {Issues} from "../../common";
/**
 * Created by lifeg on 24/11/2016.
 */

export class PrsFail extends ParjsBasicAction {
    displayName = "fail";
    constructor(private kind : ResultKind, public expecting : string) {
        super();
        [ResultKind.OK as ResultKind, ResultKind.Unknown].includes(kind) && Issues.expectedFailureKind(this);
    }

    _apply(ps : ParsingState) {
        ps.kind = this.kind;
        ps.expecting = this.expecting;
    }
}