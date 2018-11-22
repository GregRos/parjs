/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ReplyKind} from "../../../../reply";
import {ParsingState} from "../../state";

/**
 * Created by User on 21-Nov-16.
 */
export class PrsMustCapture extends ParjsAction {

    isLoud: boolean;
    expecting: string;

    constructor(private _inner: AnyParserAction, private _failType: ReplyKind) {
        super();
        this.isLoud = _inner.isLoud;
        this.expecting = `internal parser ${_inner.displayName} to consume input`;
    }

    _apply(ps: ParsingState) {
        let {_inner, _failType} = this;
        let {position} = ps;
        _inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.kind = position !== ps.position ? ReplyKind.Ok : _failType;
    }
}