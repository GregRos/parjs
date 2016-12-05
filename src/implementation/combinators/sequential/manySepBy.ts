import {JaseParserAction} from "../../../base/parser-action";
import {quietReturn, Issues} from "../../common";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsManySepBy extends JaseParserAction {
    isLoud : boolean;
    displayName="manySepBy";
    expecting : string;
    constructor(private many : AnyParserAction, private sep : AnyParserAction, private maxIterations : number) {
        super();
        this.isLoud = many.isLoud;
        this.expecting = many.expecting;
    }

    _apply(ps : ParsingState) {
        let {many, sep, maxIterations, isLoud} = this;
        let {position} = ps;
        let arr = [];
        many.apply(ps);
        if (ps.result >= ResultKind.HardFail) {
            return;
        } else if (ps.isSoft) {
            ps.value = [];
            return;
        }
        let i = 0;
        while (true) {
            if (i >= maxIterations) break;
            sep.apply(ps);
            if (ps.isSoft) {
                break;
            } else if (ps.result >= ResultKind.HardFail) {
                return;
            }
            many.apply(ps);
            if (ps.isSoft) {
                break;
            } else if (ps.result >= ResultKind.HardFail) {
                return;
            }
            if (maxIterations >= Infinity && ps.position === position) {
                Issues.guardAgainstInfiniteLoop(this);
            }
            arr.maybePush(ps.value);
            position = ps.position;
            i++;
        }
        ps.result = ResultKind.OK;
        ps.position = position;
        ps.value = arr;
        return;
    }
}