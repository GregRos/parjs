import {ParjsAction} from "../../../base/action";
import {QUIET_RESULT, Issues} from "../../common";
import {AnyParserAction} from "../../../abstract/basics/action";
import {ParsingState} from "../../../abstract/basics/state";
import {ResultKind} from "../../../abstract/basics/result";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsManyTill extends ParjsAction {
    isLoud : boolean;
    displayName = "manyTill";
    expecting : string;
    constructor(private many : AnyParserAction, private till : AnyParserAction, private tillOptional : boolean) {
        super();
        this.isLoud = many.isLoud;
        this.expecting = `${many.expecting} or ${till.expecting}`;
    }

    _apply(ps : ParsingState) {
        let {many, till, tillOptional} = this;
        let {position} = ps;
        let arr = [];
        let successes = 0;
        while (true) {
            till.apply(ps);
            if (ps.isOk) {
                break;
            } else if (ps.atLeast(ResultKind.HardFail)) {
                //if till failed hard/fatally, we return the fail result.
                return;
            }
            //backtrack to before till failed.
            ps.position = position;
            many.apply(ps);
            if (ps.isOk) {
                arr.maybePush(ps.value);
            } else if (ps.isSoft) {
                //many failed softly before till...
                if (!tillOptional) {
                    //if we parsed at least one element, we fail hard.
                    ps.kind = successes === 0 ? ResultKind.SoftFail : ResultKind.HardFail;
                    return;
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
        ps.kind = ResultKind.OK;
    }
}
