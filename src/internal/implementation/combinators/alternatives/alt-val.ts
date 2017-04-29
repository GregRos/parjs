/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {FAIL_RESULT} from "../../special-results";
import {Issues} from '../../issues';
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";

export class PrsAltVal extends ParjsAction {

    isLoud = true;
    expecting : string;
    constructor (private inner : AnyParserAction, private val : any) {
        super();
        inner.isLoud || Issues.quietParserNotPermitted("altVal");
        this.expecting = `${inner.expecting} or anything`;
    }

    _apply(ps : ParsingState) {
        let {inner, val} = this;
        inner.apply(ps);
        if (ps.isSoft) {
            //on soft failure, set the value and result to OK
            ps.value = val;
            ps.kind = ReplyKind.OK;
        }
        //on ok/hard/fatal, propagate the result.
    }
}