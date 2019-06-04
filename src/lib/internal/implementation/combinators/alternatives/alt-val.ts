/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {QUIET_RESULT} from "../../special-results";
import {ParserDefinitionError} from "../../../../errors";

export class PrsMaybe extends ParjsAction {
    isLoud: boolean;
    expecting: string;

    constructor(private _inner: AnyParserAction, private _val: any) {
        super();
        if (_val !== QUIET_RESULT && !_inner.isLoud) {
            throw new ParserDefinitionError("altVal", "the inner parser must be loud if an alternative value is supplied.");
        } else if (_inner.isLoud && _val === QUIET_RESULT) {
            throw new ParserDefinitionError("altVal", "the inner parser must be quiet if an alternative value is not supplied.");
        }
        this.isLoud = _inner.isLoud;

        this.expecting = `${_inner.expecting} or anything`;
    }

    _apply(ps: ParsingState) {
        let {_inner, _val} = this;
        _inner.apply(ps);
        if (ps.isSoft) {
            //on soft failure, set the value and result to OK
            if (this.isLoud) ps.value = _val;
            ps.kind = ReplyKind.Ok;
        }
        //on ok/hard/fatal, propagate the result.
    }
}