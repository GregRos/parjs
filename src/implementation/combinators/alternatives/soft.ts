/**
 * Created by User on 13-Dec-16.
 */
import {ParjsAction} from "../../../base/action";
import {Issues} from "../../common";
import {AnyParserAction} from "../../../abstract/basics/action";
import {ParsingState} from "../../../abstract/basics/state";
import {ResultKind} from "../../../abstract/basics/result";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsSoft extends ParjsAction {
    isLoud : boolean;
    displayName = "soft";
    expecting : string;
    constructor(private inner : AnyParserAction) {
        super();
        this.isLoud = inner.isLoud;
        this.expecting = inner.expecting;
    }

    _apply(ps : ParsingState) {
        this.inner.apply(ps);
        if (ps.isHard) {
            ps.kind = ResultKind.SoftFail;
        }
    }
}
