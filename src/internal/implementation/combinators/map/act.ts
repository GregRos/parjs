/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {QUIET_RESULT} from "../../special-results";
import {Issues} from '../../issues';
import {ParsingState} from "../../state";

export class ActParser extends ParjsAction {

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



