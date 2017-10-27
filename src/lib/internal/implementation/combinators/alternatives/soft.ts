/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {Issues} from "../../issues";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";

export class PrsSoft extends ParjsAction {
    isLoud : boolean;

    expecting : string;
    constructor(private inner : AnyParserAction) {
        super();
        this.isLoud = inner.isLoud;
        this.expecting = inner.expecting;
    }

    _apply(ps : ParsingState) {
        this.inner.apply(ps);
        if (ps.isHard) {
            ps.kind = ReplyKind.SoftFail;
        }
    }
}
