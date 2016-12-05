import {ParjsParserAction} from "../../../base/action";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsMustCapture extends ParjsParserAction {
    displayName = "mustCapture";
    isLoud : boolean;
    expecting : string;
    constructor(private inner : AnyParserAction, private failType : ResultKind) {
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
        ps.result = position !== ps.position ? ResultKind.OK : failType;
    }
}