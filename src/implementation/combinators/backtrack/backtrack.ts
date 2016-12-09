import {ParjsAction} from "../../../base/action";
import {ParsingState} from "../../../abstract/basics/state";
import {AnyParserAction} from "../../../abstract/basics/action";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsBacktrack extends ParjsAction {
    displayName = "backtrack";
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