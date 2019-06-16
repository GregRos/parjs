/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {RejectionInfo, ResultKind} from "../reply";
import {Parjser, ParjsProjection} from "../../parjser";
import {ParjserBase} from "../parser";
import defaults from "lodash/defaults";

const defaultFailure: RejectionInfo = {
    kind: "Soft",
    reason: "a character fulfilling a predicate"
}


export function charWhere(predicate: ParjsProjection<string, boolean>, failure?: Partial<RejectionInfo>): Parjser<string> {
    failure = defaults(failure, defaultFailure);
    return new class CharWhere extends ParjserBase {
        type = "charWhere";
        expecting = failure.reason;

        _apply(ps: ParsingState): void {
            let {position, input} = ps;
            if (position >= input.length) {
                ps.kind = failure.kind;
                return;
            }
            let curChar = input[position];
            if (!predicate(curChar, ps.userState)) {
                ps.kind = failure.kind;
                return;
            }
            ps.value = curChar;
            ps.position++;
            ps.kind = ResultKind.Ok;
        }

    }();
}

