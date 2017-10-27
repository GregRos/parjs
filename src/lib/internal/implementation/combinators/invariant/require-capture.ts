/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ReplyKind} from "../../../../reply";
import {ParsingState} from "../../state";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsMustCapture extends ParjsAction {

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