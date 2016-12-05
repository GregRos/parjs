import {quietReturn} from "../../common";
import {ParjsParserAction} from "../../../base/action";
/**
 * Created by lifeg on 24/11/2016.
 */
export class PrsQuiet extends ParjsParserAction {
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