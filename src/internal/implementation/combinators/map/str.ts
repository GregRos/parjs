/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {QUIET_RESULT} from "../../common";
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {StringHelpers} from "../../functions/helpers";
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
            ps.value = String(value);
        }
        else if (value instanceof Array) {
            ps.value = StringHelpers.recJoin(value);
        }
        else if (typeStr === "symbol") {
            ps.value = String(value).slice(7, -1);
        }
        else {
            ps.value = value.toString();
        }

    }
}