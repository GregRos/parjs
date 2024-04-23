import type { Parjser, ParjsValidator } from "../parjser";
import { ParjserBase } from "../parser";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";

class CharWhere extends ParjserBase<string> {
    type = "charWhere";
    expecting = "expecting a character matching a predicate";
    constructor(private predicate: ParjsValidator<string>) {
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
        const curChar = input[position];
        const result = predicate(curChar, ps.userState);
        if (result !== true) {
            ps.reason = result.reason || this.expecting;
            ps.kind = result.kind || "Soft";
            return;
        }
        ps.value = curChar;
        ps.position++;
        ps.kind = ResultKind.Ok;
    }
}

/**
 * Returns a parser that parses a single character fulfilling `predicate`.
 *
 * @param predicate The predicate the character has to fulfill.
 */
export function charWhere(predicate: ParjsValidator<string>): Parjser<string> {
    return new CharWhere(predicate);
}
