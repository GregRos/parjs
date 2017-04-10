import {ParjsBasicAction} from "../../../base/action";
import {ReplyKind} from "../../../abstract/basics/result";
import {ParsingState} from "../../../abstract/basics/state";
import {Issues} from "../../common";
/**
 * Created by lifeg on 24/11/2016.
 */

export class PrsFail extends ParjsBasicAction {
    displayName = "fail";
    constructor(private kind : ReplyKind, public expecting : string) {
        super();
        [ReplyKind.OK as ReplyKind, ReplyKind.Unknown].includes(kind) && Issues.expectedFailureKind(this);
    }

    _apply(ps : ParsingState) {
        ps.kind = this.kind;
        ps.expecting = this.expecting;
    }
}