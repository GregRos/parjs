/**
 * Created by lifeg on 02/04/2017.
 */
import {ParjsAction} from "../../../base/action";
import {QUIET_RESULT, Issues} from "../../common";
import {ParsingState} from "../../../abstract/basics/state";
/**
 * Created by User on 21-Nov-16.
 */
export class ActParser extends ParjsAction {
    displayName = "act";
    expecting : string;
    get isLoud() {
        return this.inner.isLoud;
    }
    constructor(private inner : ParjsAction, private act : (result : any, state : any) => void) {
        super();
        this.expecting = inner.expecting;

    }

    _apply(ps : ParsingState) {
        let {inner, act} = this;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        act(ps.value, ps.state);
    }
}



