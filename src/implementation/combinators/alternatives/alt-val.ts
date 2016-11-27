import {JaseParserAction} from "../../../base/parser-action";
import {Issues} from "../../common";
/**
 * Created by lifeg on 23/11/2016.
 */

export class PrsAltVal extends JaseParserAction {
    displayName = "altVal";
    isLoud = true;
    constructor (private inner : AnyParserAction, private val : any) {
        super();
        inner.isLoud || Issues.quietParserNotPermitted(this);
    }

    _apply(ps : ParsingState) {
        let {inner, val} = this;
        if (inner.apply(ps)) {
            ps.result = val;
            return true;
        }
        return true;
    }
}