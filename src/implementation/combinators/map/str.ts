import {QUIET_RESULT} from "../../common";
import {ParjsAction} from "../../../base/action";
import {AnyParserAction} from "../../../abstract/basics/action";
import {ParsingState} from "../../../abstract/basics/state";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsStr extends ParjsAction {
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
        else if (value === QUIET_RESULT) {
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