/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
/**
 * Created by lifeg on 24/11/2016.
 */
export class PrsMapResult extends ParjsAction {

    isLoud = true;
    expecting : string;
    constructor(private _inner : AnyParserAction, private _result : any) {
        super();
        this.expecting = _inner.expecting;
    }

    _apply(ps : ParsingState) {
        let {_inner, _result} = this;
        _inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.value = _result;
    }
}