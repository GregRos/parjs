/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import {ParjsBasicAction} from "../../action";
import {ReplyKind} from "../../../../reply";
import {ParsingState} from "../../state";
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