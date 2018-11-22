/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {ParsingState} from "../../state";

export class PrsEach extends ParjsAction {

    expecting: string;

    constructor(private _inner: ParjsAction, private _act: (result: any, state: any) => void) {
        super();
        this.expecting = _inner.expecting;

    }

    get isLoud() {
        return this._inner.isLoud;
    }

    _apply(ps: ParsingState) {
        let {_inner, _act} = this;
        _inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        _act(ps.value, ps.userState);
    }
}



