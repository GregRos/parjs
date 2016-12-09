import {ParjsAction} from "../../../base/action";
import {Issues, FAIL_RESULT} from "../../common";
import {AnyParserAction} from "../../../abstract/basics/action";
import {ParsingState} from "../../../abstract/basics/state";
import {ResultKind} from "../../../abstract/basics/result";
/**
 * Created by lifeg on 23/11/2016.
 */

export class PrsAltVal extends ParjsAction {
    displayName = "altVal";
    isLoud = true;
    expecting : string;
    constructor (private inner : AnyParserAction, private val : any) {
        super();
        inner.isLoud || Issues.quietParserNotPermitted(this);
        this.expecting = `${inner.expecting} or anything`;
    }

    _apply(ps : ParsingState) {
        let {inner, val} = this;
        inner.apply(ps);
        if (ps.isSoft) {
            //on soft failure, set the value and result to OK
            ps.value = val;
            ps.kind = ResultKind.OK;
        }
        //on ok/hard/fatal, propagate the result.
    }
}