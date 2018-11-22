/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {Issues} from "../../issues";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {ArrayHelpers} from "../../functions/helpers";

/**
 * Created by User on 21-Nov-16.
 */
export class PrsManyTill extends ParjsAction {
    isLoud: boolean;

    expecting: string;

    constructor(private _many: AnyParserAction, private _till: AnyParserAction, private _tillOptional: boolean) {
        super();
        this.isLoud = _many.isLoud;
        this.expecting = `${_many.expecting} or ${_till.expecting}`;
    }

    _apply(ps: ParsingState) {
        let {_many, _till, _tillOptional} = this;
        let {position} = ps;
        let arr = [];
        let successes = 0;
        while (true) {
            _till.apply(ps);
            if (ps.isOk) {
                break;
            } else if (ps.atLeast(ReplyKind.HardFail)) {
                //if till failed hard/fatally, we return the fail result.
                return;
            }
            //backtrack to before till failed.
            ps.position = position;
            _many.apply(ps);
            if (ps.isOk) {
                ArrayHelpers.maybePush(arr, ps.value);
            } else if (ps.isSoft) {
                //many failed softly before till...
                if (!_tillOptional) {
                    //if we parsed at least one element, we fail hard.
                    ps.kind = successes === 0 ? ReplyKind.SoftFail : ReplyKind.HardFail;
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
                Issues.guardAgainstInfiniteLoop("manyTill");
            }
            position = ps.position;
            successes++;
        }
        ps.value = arr;
        ps.kind = ReplyKind.Ok;
    }
}
