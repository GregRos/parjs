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
        let successes = 0;
        while (true) {
            till.apply(ps);
            if (ps.result.isOk) {
                break;
            } else if (ps.result >= ResultKind.HardFail) {
                //if till failed hard/fatally, we return the fail result.
                return;
            }
            //backtrack to before till failed.
            ps.position = position;
            many.apply(ps);
            if (ps.result.isOk) {
                arr.maybePush(ps.value);
            } else if (ps.result.isSoft) {
                //many failed softly before till...
                if (!tillOptional) {
                    //if we parsed at least one element, we fail hard.
                    ps.result = successes === 0 ? ResultKind.SoftFail : ResultKind.HardFail
                } else {
                    //till was optional, so many failing softly is OK.
                    break;
                }
            } else {
                //many failed hard/fatal
                return;
            }
            if (ps.position === position) {
                Issues.guardAgainstInfiniteLoop(this);
            }
            position = ps.position;
            successes++;
        }
        ps.value = arr;
        ps.result = ResultKind.OK;
    }
}
