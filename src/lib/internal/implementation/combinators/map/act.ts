/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {ParsingState} from "../../state";

export class ActParser extends ParjsAction {

    expecting : string;
    get isLoud() {
        return this._inner.isLoud;
    }
    constructor(private _inner : ParjsAction, private _act : (result : any, state : any) => void) {
        super();
        this.expecting = _inner.expecting;

    }

    _apply(ps : ParsingState) {
        let {_inner, _act} = this;
        _inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        _act(ps.value, ps.userState);
    }
}



