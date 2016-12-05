import {ParjsParserAction} from "../../../base/action";
import {quietReturn} from "../../common";
/**
 * Created by User on 22-Nov-16.
 */
export class PrsNot extends ParjsParserAction {
    displayName = "not";
    isLoud = false;
    expecting : string;
    constructor(private inner : AnyParserAction) {
        super();
        this.expecting = `not: ${inner.expecting}`;
    };

    _apply(ps : ParsingState) {
        let {inner} = this;
        let {position} = ps;
        inner.apply(ps);
        if (ps.isOk) {
            ps.position = position;
            ps.result = ResultKind.SoftFail;
        }
        else if (ps.result <= ResultKind.HardFail) {
            //hard fails are okay here
            ps.result = ResultKind.OK;
            ps.position = position;
            return;
        }
        //the remaining case is a fatal failure that isn't recovered from.
    }
}