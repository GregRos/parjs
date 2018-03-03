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

    constructor(private _kind : ReplyKind, public expecting : string) {
        super();
        [ReplyKind.Ok as ReplyKind, ReplyKind.Unknown].indexOf(_kind) >= 0 && Issues.expectedFailureKind("fail");
    }

    _apply(ps : ParsingState) {
        ps.kind = this._kind;
        ps.expecting = this.expecting;
    }
}