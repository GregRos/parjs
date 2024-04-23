import type { Parjser } from "../parjser";
import { ParjserBase } from "../parser";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";

/**
 * Returns a parser that succeeds without consuming input and yields the current position as an
 * integer.
 */
export function position(): Parjser<number> {
    return new (class Position extends ParjserBase<number> {
        type = "position";
        expecting = "anything";

        _apply(ps: ParsingState) {
            ps.value = ps.position;
            ps.kind = ResultKind.Ok;
        }
    })();
}
