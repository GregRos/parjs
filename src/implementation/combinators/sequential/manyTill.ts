import {JaseParserAction} from "../../../base/parser-action";
import {quietReturn, Issues} from "../../common";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsManyTill extends JaseParserAction {
    isLoud : boolean;
    displayName = "manyTill";
    constructor(private many : AnyParserAction, private till : AnyParserAction, private tillOptional : boolean) {
        super();
        this.isLoud = many.isLoud;
    }

    _apply(ps : ParsingState) {
        let {many, till, tillOptional} = this;
        let {position} = ps;
        let arr = [];
        let manyFailed = false;
        while (true) {
            if (till.apply(ps)) {
                break;
            }
            //backtrack to before till failed.
            ps.position = position;
            if (many.apply(ps)) {
                manyFailed = true;
                arr.maybePush(ps.result);
                break;
            }
            if (ps.position === position) {
                Issues.guardAgainstInfiniteLoop(this);
            }
            position = ps.position;
        }
        if (!manyFailed || tillOptional) {
            return false;
        }
        ps.result = arr;
    }
}
