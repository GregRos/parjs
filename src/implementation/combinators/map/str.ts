import {quietReturn} from "../../common";
import {JaseParserAction} from "../../../base/parser-action";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsStr extends JaseParserAction {
    displayName = "str";
    isLoud = true;
    expecting : string;
    constructor(private inner : AnyParserAction) {
        super();
        this.expecting = inner.expecting;
    }

    _apply(ps : ParsingState) {
        let {inner} = this;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        let {value} = ps;
        let typeStr = typeof value;
        if (typeStr === "string") {

        }
        else if (value === quietReturn) {
            ps.value = "";
        }
        else if (value === null || value === undefined) {
            ps.value = Object.prototype.toString.call(value);
        }
        else if (value instanceof Array) {
            ps.value = value.join("");
        }
        else if (typeStr === "symbol") {
            ps.value = value.description;
        }
        else {
            ps.value = value.toString();
        }

    }
}