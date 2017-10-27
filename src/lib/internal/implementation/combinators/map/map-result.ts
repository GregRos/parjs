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
    constructor(private inner : AnyParserAction, private result : any) {
        super();
        this.expecting = inner.expecting;
    }

    _apply(ps : ParsingState) {
        let {inner, result} = this;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.value = result;
    }
}