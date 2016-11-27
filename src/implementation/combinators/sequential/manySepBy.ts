import {JaseParserAction} from "../../../base/parser-action";
import {quietReturn, Issues} from "../../common";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsManySepBy extends JaseParserAction {
    isLoud : boolean;
    displayName="manySepBy";
    constructor(private many : AnyParserAction, private sep : AnyParserAction, private maxIterations : number) {
        super();
        this.isLoud = many.isLoud;
    }

    _apply(ps : ParsingState) {
        let {many, sep, maxIterations, isLoud} = this;
        let {position} = ps;
        let arr = [];
        if (!many.apply(ps)) {
            return false;
        }
        let manyFailed = false;
        let i = 0;
        while (true) {
            if (i > maxIterations) break;
            if (!sep.apply(ps)) {
                break;
            }
            if (!many.apply(ps)) {
                manyFailed = true;
                break;
            }
            if (maxIterations < Infinity && ps.position === position) {
                Issues.guardAgainstInfiniteLoop(this);
            }
            arr.maybePush(ps.result);
            position = ps.position;
            i++;
        }
        ps.position = position;
        ps.result = arr;
        return true;
    }
}