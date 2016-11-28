import {JaseParserAction} from "../../../base/parser-action";
import {quietReturn} from "../../common";
/**
 * Created by User on 27-Nov-16.
 */
export class PrsSkip extends JaseParserAction {
    displayName = "skip";
    isLoud = false;
    constructor(private skipCount : number) {
        super();
    }

    _apply(ps : ParsingState) {
        let {skipCount} = this;
        if (ps.position + skipCount > ps.input.length) return false;
        ps.position += skipCount;
        ps.result = quietReturn;
        return true;
    }
}