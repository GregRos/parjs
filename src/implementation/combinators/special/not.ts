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
        if (inner.apply(ps)) {
            return false;
        }
        ps.position = position;
        ps.result = quietReturn;
        return true;
    }
}