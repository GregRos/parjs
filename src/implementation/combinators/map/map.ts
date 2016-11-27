import {JaseParserAction} from "../../../base/parser-action";
import {quietReturn, Issues} from "../../common";
/**
 * Created by User on 21-Nov-16.
 */
export class MapParser extends JaseParserAction {
    displayName = "map";
    isLoud = true;
    constructor(private inner : JaseParserAction, private map : (x : any) => any) {
        super();
        Issues.quietParserNotPermitted(this);
    }

    _apply(ps : ParsingState) {
        let {inner, map} = this;
        if (!inner.apply(ps)) {
            return false;
        }
        ps.result = map(ps.result);
        return true;
    }
}



