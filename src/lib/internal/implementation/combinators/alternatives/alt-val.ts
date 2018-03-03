/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {Issues} from "../../issues";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";

export class PrsAltVal extends ParjsAction {

    isLoud = true;
    expecting : string;
    constructor (private _inner : AnyParserAction, private _val : any) {
        super();
        _inner.isLoud || Issues.quietParserNotPermitted("altVal");
        this.expecting = `${_inner.expecting} or anything`;
    }

    _apply(ps : ParsingState) {
        let {_inner, _val} = this;
        _inner.apply(ps);
        if (ps.isSoft) {
            //on soft failure, set the value and result to OK
            ps.value = _val;
            ps.kind = ReplyKind.Ok;
        }
        //on ok/hard/fatal, propagate the result.
    }
}