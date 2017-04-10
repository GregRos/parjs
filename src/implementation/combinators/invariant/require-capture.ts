import {ParjsAction} from "../../../base/action";
import {AnyParserAction} from "../../../abstract/basics/action";
import {ReplyKind} from "../../../abstract/basics/result";
import {ParsingState} from "../../../abstract/basics/state";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsMustCapture extends ParjsAction {
    displayName = "mustCapture";
    isLoud : boolean;
    expecting : string;
    constructor(private inner : AnyParserAction, private failType : ReplyKind) {
        super();
        this.isLoud = inner.isLoud;
        this.expecting = `internal parser ${inner.displayName} to consume input`;
    }

    _apply(ps : ParsingState) {
        let {inner, failType} = this;
        let {position} = ps;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.kind = position !== ps.position ? ReplyKind.OK : failType;
    }
}