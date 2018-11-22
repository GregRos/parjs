/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {ArrayHelpers} from "../../functions/helpers";

/**
 * Created by User on 21-Nov-16.
 */
export class PrsExactly extends ParjsAction {
    isLoud: boolean;

    expecting: string;

    constructor(private _inner: AnyParserAction, private _count: number) {
        super();
        this.isLoud = _inner.isLoud;
        this.expecting = _inner.expecting;
    }

    _apply(ps: ParsingState) {
        let {_inner, _count, isLoud} = this;
        let arr = [];
        for (let i = 0; i < _count; i++) {
            _inner.apply(ps);
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