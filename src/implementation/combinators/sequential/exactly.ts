import {JaseParserAction} from "../../../base/parser-action";
import {quietReturn} from "../../common";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsExactly extends JaseParserAction {
    isLoud : boolean;
    displayName = "exactly";
    constructor(private inner : AnyParserAction, private count : number) {
        super();
        this.isLoud = inner.isLoud;
    }

    _apply(ps : ParsingState) {
        let {inner, count, isLoud} = this;
        let arr = [];
        for (let i = 0; i < count; i++) {
            if (!inner.apply(ps)) {
                //fail because the inner parser has failed.
                return false;
            }
            isLoud && arr.maybePush(ps.result);
        }
        ps.result = isLoud ? arr : quietReturn;
        return true;
    }
}