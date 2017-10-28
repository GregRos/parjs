/**
 * @module parjs/internal/implementation/parsers
 */ /** */
import {ParjsBasicAction} from "../../action";
import {ReplyKind} from "../../../../reply";
import {ParsingState} from "../../state";
import {Issues} from "../../issues";
/**
 * Created by lifeg on 24/11/2016.
 */

export class PrsFail extends ParjsBasicAction {

    constructor(private kind : ReplyKind, public expecting : string) {
        super();
        [ReplyKind.OK as ReplyKind, ReplyKind.Unknown].indexOf(kind) >= 0 && Issues.expectedFailureKind("fail");
    }

    _apply(ps : ParsingState) {
        ps.kind = this.kind;
        ps.expecting = this.expecting;
    }
}