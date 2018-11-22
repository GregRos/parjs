/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {ParsingState} from "../../state";
import {AnyParserAction} from "../../../action";

export class PrsBacktrack extends ParjsAction {

    isLoud: boolean;
    expecting: string;

    constructor(private _inner: AnyParserAction) {
        super();
        this.isLoud = _inner.isLoud;
        this.expecting = _inner.expecting;
    }

    _apply(ps: ParsingState) {
        let {_inner} = this;
        let {position} = ps;
        _inner.apply(ps);
        if (ps.isOk) {
            //if inner succeeded, we backtrack.
            ps.position = position;
        }
        //whatever code ps had, we return it.
    }
}