/**
 * @module parjs
 */
/** */

import {ParsingState} from "../state";
import {FailureInfo, ResultKind} from "../result";
import {Parjser, ParjsProjection, ParjsValidator} from "../parjser";
import {ParjserBase} from "../parser";
import defaults from "lodash/defaults";

const defaultFailure: FailureInfo = {
    kind: "Soft",
    reason: "expecting a character fulfilling a predicate"
};


/**
 * Returns a parser that parses a single character fulfilling `predicate`.
 * @param predicate The predicate the character has to fulfill.
 */
export function charWhere(predicate: ParjsValidator<string>): Parjser<string> {
    return new class CharWhere extends ParjserBase {
        type = "charWhere";
        expecting = "expecting a character matching a predicate";

        _apply(ps: ParsingState): void {
            let {position, input} = ps;
            if (position >= input.length) {
                ps.kind = ResultKind.SoftFail;
                ps.reason = "expecting a character";
                return;
            }
            let curChar = input[position];
            let result = predicate(curChar, ps.userState);
            if (result !== true) {
                ps.reason = result.reason || this.expecting;
                ps.kind = result.kind || "Soft";
                return;
            }
            ps.value = curChar;
            ps.position++;
            ps.kind = ResultKind.Ok;
        }

    }();
}

