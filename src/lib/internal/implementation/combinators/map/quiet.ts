/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
/**
 * Created by lifeg on 24/11/2016.
 */
export class PrsQuieten extends ParjsAction {

    isLoud = false;
    expecting : string;
    constructor(private _inner : AnyParserAction) {
        super();
        this.expecting = _inner.expecting;
    }

    _apply(ps : ParsingState) {
        let {_inner} = this;
        _inner.apply(ps);
    }
}