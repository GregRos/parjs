/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {ParsingState} from "../../state";

/**
 * Created by User on 21-Nov-16.
 */
export class PrsProject extends ParjsAction {

    isLoud = true;
    expecting: string;

    constructor(private _inner: ParjsAction, private _map: (x: any, y: any) => any) {
        super();
        this.expecting = _inner.expecting;
    }

    _apply(ps: ParsingState) {
        let {_inner, _map} = this;
        _inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.value = _map(ps.value, ps.userState);
    }
}

