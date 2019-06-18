/**
 * @module parjs
 */ /** */


import {FailureInfo, ResultKind} from "../result";
import {ParsingState} from "../state";
import {ParjserBase} from "../parser";
import {Parjser, ParjsValidator} from "../parjser";
import defaults from "lodash/defaults";

const defaultFailure: FailureInfo = {
    kind: "Soft",
    reason: "any character fulfilling a predicate"
};

/**
 * Returns a parser that parses one character, and checks its code fulfills `predicate`.
 * @param predicate
 * @param failure
 */
export function charCodeWhere(predicate: ParjsValidator<number>): Parjser<string> {
    return new class CharCodeWhere extends ParjserBase {
        type = "charCodeWhere";
        expecting = "expecting a character matching a predicate";

        _apply(ps: ParsingState): void {
            let {position, input} = ps;
            if (position >= input.length) {
                ps.kind = ResultKind.SoftFail;
                ps.reason = "expecting a character";
                return;
            }
            let curChar = input.charCodeAt(position);
            let result = predicate(curChar, ps.userState);
            if (result !== true) {
                ps.kind = result.kind || "Soft";
                ps.reason = result.reason || "expecting a character matching a predicate";
                return;
            }
            ps.value = String.fromCharCode(curChar);
            ps.position++;
            ps.kind = ResultKind.Ok;
        }

    }();
}

