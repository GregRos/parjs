/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";

export class PrsSoften extends ParjsAction {
    isLoud : boolean;

    expecting : string;
    constructor(private _inner : AnyParserAction) {
        super();
        this.isLoud = _inner.isLoud;
        this.expecting = _inner.expecting;
    }

    _apply(ps : ParsingState) {
        this._inner.apply(ps);
        if (ps.isHard) {
            ps.kind = ReplyKind.SoftFail;
        }
    }
}
