import {JaseParserAction} from "../../../base/parser-action";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsMustCapture extends JaseParserAction {
    displayName = "mustCapture";
    isLoud : boolean;
    constructor(private inner : AnyParserAction, private failType : ResultKind) {
        super();
        this.isLoud = inner.isLoud;
    }

    _apply(ps : ParsingState) {
        let {inner, failType} = this;
        let {position} = ps;
        inner.apply(ps);
        if (!ps.result.isOk) {
            return;
        }
        ps.result = position !== ps.position ? ResultKind.OK : failType;
    }
}