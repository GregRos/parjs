import {QUIET_RESULT} from "../../common";
import {ParjsAction} from "../../../base/action";
import {AnyParserAction} from "../../../abstract/basics/action";
import {ParsingState} from "../../../abstract/basics/state";
/**
 * Created by lifeg on 24/11/2016.
 */
export class PrsQuiet extends ParjsAction {
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