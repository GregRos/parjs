/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {Issues} from "../../issues";
import {ReplyKind} from "../../../../reply";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ArrayHelpers} from "../../functions/helpers";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsManySepBy extends ParjsAction {
    isLoud : boolean;

    expecting : string;
    constructor(private _many : AnyParserAction, private _sep : AnyParserAction, private _maxIterations : number) {
        super();
        this.isLoud = _many.isLoud;
        this.expecting = _many.expecting;
    }

    _apply(ps : ParsingState) {
        let {_many, _sep, _maxIterations, isLoud} = this;
        let arr = [];
        _many.apply(ps);
        if (ps.atLeast(ReplyKind.HardFail)) {
            return;
        } else if (ps.isSoft) {
            ps.value = [];
            ps.kind = ReplyKind.Ok;
            return;
        }
        let {position} = ps;
        ArrayHelpers.maybePush(arr, ps.value);
        let i = 1;
        while (true) {
            if (i >= _maxIterations) break;
            _sep.apply(ps);
            if (ps.isSoft) {
                break;
            } else if (ps.atLeast(ReplyKind.HardFail)) {
                return;
            }

            _many.apply(ps);
            if (ps.isSoft) {
                break;
            } else if (ps.atLeast(ReplyKind.HardFail)) {
                return;
            }
            if (_maxIterations >= Infinity && ps.position === position) {
                Issues.guardAgainstInfiniteLoop("many");
            }
            ArrayHelpers.maybePush(arr, ps.value);
            position = ps.position;
            i++;
        }
        ps.kind = ReplyKind.Ok;
        ps.position = position;
        ps.value = arr;
        return;
    }
}