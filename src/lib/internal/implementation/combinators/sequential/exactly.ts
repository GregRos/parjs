/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {QUIET_RESULT} from "../../special-results";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {ArrayHelpers} from "../../functions/helpers";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsExactly extends ParjsAction {
    isLoud : boolean;

    expecting : string;
    constructor(private inner : AnyParserAction, private count : number) {
        super();
        this.isLoud = inner.isLoud;
        this.expecting = inner.expecting;
    }

    _apply(ps : ParsingState) {
        let {inner, count, isLoud} = this;
        let arr = [];
        for (let i = 0; i < count; i++) {
            inner.apply(ps);
            if (!ps.isOk) {
                if (ps.kind === ReplyKind.SoftFail && i > 0) {
                    ps.kind = ReplyKind.HardFail;
                }
                //fail because the inner parser has failed.
                return;
            }
            ArrayHelpers.maybePush(arr, ps.value);
        }
        ps.value = arr;
    }
}