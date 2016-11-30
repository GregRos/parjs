import {JaseParserAction} from "../../../base/parser-action";
import {quietReturn} from "../../common";
/**
 * Created by User on 22-Nov-16.
 */
export class PrsNot extends JaseParserAction {
    displayName = "not";
    isLoud = false;
    constructor(private inner : AnyParserAction) {super()};

    _apply(ps : ParsingState) {
        let {inner} = this;
        let {position} = ps;
        inner.apply(ps)
        if (ps.result.isOk) {
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