/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {Issues} from "../../issues";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";

export class PrsAlternatives extends ParjsAction {
    isLoud: boolean;

    expecting: string;

    constructor(private _alts: AnyParserAction[]) {
        super();
        //if the list is empty, every won't execute and alts[0] won't be called.
        if (!_alts.every(x => x.isLoud === _alts[0].isLoud)) {
            Issues.mixedLoudnessNotPermitted("alts");
        }
        _alts.length === 0 && Issues.willAlwaysFail("alts");
        this.isLoud = _alts[0].isLoud;
        this.expecting = `any of: ${_alts.join(", ")}`;
    }

    _apply(ps: ParsingState) {
        let {position} = ps;
        let {_alts} = this;
        for (let i = 0; i < _alts.length; i++) {
            //go over each alternative.
            let cur = _alts[i];
            //apply it on the current state.
            cur.apply(ps);
            if (ps.isOk) {
                //if success, return. The PS records the result.
                return;
            } else if (ps.isSoft) {
                //backtrack to the original position and try again.
                ps.position = position;
            } else {
                //if failure, return false,
                return;
            }
        }
        ps.kind = ReplyKind.SoftFail;
    }
}
