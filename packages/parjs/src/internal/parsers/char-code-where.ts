import type { Parjser, ParjsValidator } from "../parjser";
import { ParjserBase } from "../parser";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";

class CharCodeWhere extends ParjserBase<string> {
    type = "charCodeWhere";
    expecting = "expecting a character matching a predicate";

    constructor(private predicate: ParjsValidator<number>) {
        super();
    }

    _apply(ps: ParsingState): void {
        const { position, input } = ps;
        const predicate = this.predicate;
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
}

/**
 * Returns a parser that parses one character, and checks its code fulfills `predicate`.
 *
 * @param predicate
 */
export function charCodeWhere(predicate: ParjsValidator<number>): Parjser<string> {
    return new CharCodeWhere(predicate);
}
