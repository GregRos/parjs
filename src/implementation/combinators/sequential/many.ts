import {JaseParserAction} from "../../../base/parser-action";
import {quietReturn, Issues} from "../../common";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsMany extends JaseParserAction {
    isLoud : boolean;
    displayName = "many";
    expecting : string;
    constructor(private inner : AnyParserAction, private maxIterations : number, private minSuccesses : number) {
        super();
        this.isLoud = inner.isLoud;
        this.expecting = inner.expecting;
    }

    _apply(ps : ParsingState) {
        let {inner, maxIterations, minSuccesses} = this;
        let {position} = ps;
        let arr = [];
        let i = 0;
        while (true) {
            inner.apply(ps);
            if (!ps.isOk) break;
            if (i >= maxIterations) break;
            if (maxIterations < Infinity && ps.position === position) {
                Issues.guardAgainstInfiniteLoop(this);
            }
            position = ps.position;
            arr.maybePush(ps.value);
            i++;
        }
        if (ps.result >= ResultKind.HardFail) {
            return;
        }
        if (i < minSuccesses) {
            ps.result = i === 0 ? ResultKind.SoftFail : ResultKind.HardFail;
            return;
        }
        ps.value = arr;
        //recover from the last failure.
        ps.position = position;
        return ResultKind.OK;
    }
}