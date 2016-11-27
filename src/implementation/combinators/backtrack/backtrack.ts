import {JaseParserAction} from "../../../base/parser-action";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsBacktrack extends JaseParserAction {
    displayName = "backtrack";
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
        ps.position = position;
        return true;
    }
}