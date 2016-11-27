import {quietReturn} from "../../common";
import {JaseParserAction} from "../../../base/parser-action";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsStr extends JaseParserAction {
    displayName = "str";
    isLoud = true;
    constructor(private inner : AnyParserAction) {
        super();
    }

    _apply(ps : ParsingState) {
        let {inner} = this;
        if (!inner.apply(ps)) {
            return false;
        }
        let {result} = ps;
        let typeStr = typeof result;
        if (typeStr === "string") {

        }
        else if (result === quietReturn) {
            ps.result = "";
        }
        else if (result === null || result === undefined) {
            ps.result = Object.prototype.toString.call(result);
        }
        else if (result instanceof Array) {
            ps.result = result.join("");
        }
        else if (typeStr === "symbol") {
            ps.result = result.description;
        }
        else {
            ps.result = result.toString();
        }
        return true;
    }
}