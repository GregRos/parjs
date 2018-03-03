/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {Issues} from "../../issues";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {ArrayHelpers} from "../../functions/helpers";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsMany extends ParjsAction {
    isLoud : boolean;

    expecting : string;
    constructor(private _inner : AnyParserAction, private _maxIterations : number, private _minSuccesses : number) {
        super();
        this.isLoud = _inner.isLoud;
        this.expecting = _inner.expecting;
        _maxIterations >= _minSuccesses || Issues.willAlwaysFail("many");
    }

    _apply(ps : ParsingState) {
        let {_inner, _maxIterations, _minSuccesses} = this;
        let {position} = ps;
        let arr = [];
        let i = 0;
        while (true) {
            _inner.apply(ps);
            if (!ps.isOk) break;
            if (i >= _maxIterations) break;
            if (_maxIterations === Infinity && ps.position === position) {
                Issues.guardAgainstInfiniteLoop("many");
            }
            position = ps.position;
            ArrayHelpers.maybePush(arr, ps.value);
            i++;
        }
        if (ps.atLeast(ReplyKind.HardFail)) {
            return;
        }
        if (i < _minSuccesses) {
            ps.kind = i === 0 ? ReplyKind.SoftFail : ReplyKind.HardFail;
            return;
        }
        ps.value = arr;
        //recover from the last failure.
        ps.position = position;
        ps.kind = ReplyKind.Ok;
    }
}