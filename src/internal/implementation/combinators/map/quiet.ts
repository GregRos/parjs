/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {QUIET_RESULT} from "../../common";
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
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