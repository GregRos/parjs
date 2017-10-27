/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {ParsingState} from "../../state";
import {AnyParserAction} from "../../../action";
export class PrsBacktrack extends ParjsAction {

    isLoud : boolean;
    expecting : string;
    constructor(private inner : AnyParserAction) {
        super();
        this.isLoud = inner.isLoud;
        this.expecting = inner.expecting;
    }

    _apply(ps : ParsingState) {
        let {inner} = this;
        let {position} = ps;
        inner.apply(ps);
        if (ps.isOk) {
            //if inner succeeded, we backtrack.
            ps.position = position;
        }
        //whatever code ps had, we return it.
    }
}