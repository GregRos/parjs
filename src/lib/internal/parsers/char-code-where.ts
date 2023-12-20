/**
 * @module parjs
 */ /** */

import { ResultKind } from "../result";
import type { ParsingState } from "../state";
import { ParjserBase } from "../parser";
import type { Parjser, ParjsValidator } from "../parjser";

/**
 * Returns a parser that parses one character, and checks its code fulfills `predicate`.
 * @param predicate
 * @param failure
 */
export function charCodeWhere(predicate: ParjsValidator<number>): Parjser<string> {
    return new (class CharCodeWhere extends ParjserBase<string> {
        type = "charCodeWhere";
        expecting = "expecting a character matching a predicate";

        _apply(ps: ParsingState): void {
            const { position, input } = ps;
            if (position >= input.length) {
                ps.kind = ResultKind.SoftFail;
                ps.reason = "expecting a character";
                return;
            }
            const curChar = input.charCodeAt(position);
            const result = predicate(curChar, ps.userState);
            if (result !== true) {
                ps.kind = result.kind || "Soft";
                ps.reason = result.reason || "expecting a character matching a predicate";
                return;
            }
            ps.value = String.fromCharCode(curChar);
            ps.position++;
            ps.kind = ResultKind.Ok;
        }
    })();
}
