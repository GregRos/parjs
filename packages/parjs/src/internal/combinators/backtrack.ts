import type { ParjsCombinator } from "../../";
import { Combinated } from "../combinated";
import type { ParsingState } from "../state";
import { defineCombinator } from "./combinator";

class Backtrack<T> extends Combinated<T, T> {
    type = "backtrack";
    expecting = this.source.expecting;

    _apply(ps: ParsingState): void {
        const { position } = ps;
        this.source.apply(ps);
        if (ps.isOk) {
            // if inner succeeded, we backtrack.
            ps.position = position;
        }
        // whatever code ps had, we return it.
    }
}

/**
 * Applies the source parser. If it succeeds, backtracks to the current position in the input and
 * yields the result.
 */
export function backtrack<T>(): ParjsCombinator<T, T> {
    return defineCombinator<T, T>(source => {
        return new Backtrack<T>(source);
    });
}
