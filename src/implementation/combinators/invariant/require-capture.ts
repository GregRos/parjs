import {JaseParserAction} from "../../../base/parser-action";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsMustCapture extends JaseParserAction {
    displayName = "mustCapture";
    isLoud : boolean;
    constructor(private inner : AnyParserAction) {
        super();
        this.isLoud = inner.isLoud;
    }

    _apply(ps : ParsingState) {
        let {inner} = this;
        let {position} = ps;
        if (!inner.apply(ps)) {
            return false;
        }
        return position !== ps.position;
    }
}