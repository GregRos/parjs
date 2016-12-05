import {quietReturn} from "../../common";
import {JaseParserAction} from "../../../base/parser-action";
/**
 * Created by lifeg on 24/11/2016.
 */
export class PrsQuiet extends JaseParserAction {
    displayName = "quiet";
    isLoud = false;
    expecting : string;
    constructor(private inner : AnyParserAction) {
        super();
        this.expecting = inner.expecting;
    }

    _apply(ps : ParsingState) {
        let {inner} = this;
        inner.apply(ps);
    }
}