/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {AnyParserAction} from "../../../action";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsMust extends ParjsAction {
    isLoud : boolean;
    expecting : string;
    constructor(
        private _inner : AnyParserAction,
        private _requirement : (result : any, state : any) => boolean,
        private _failType,
        private _qualityName
    ) {
        super();
        this.isLoud = _inner.isLoud;
        this.expecting = `internal parser ${_inner.displayName} yielding a result satisfying ${_qualityName}`;
    }

    _apply(ps : ParsingState) {
        let {_inner, _requirement, _failType} = this;
        _inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.kind = _requirement(ps.value, ps.userState) ? ReplyKind.Ok : _failType;
    }
}