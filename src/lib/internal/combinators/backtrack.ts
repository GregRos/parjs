/**
 * @module parjs/combinators
 */
/** */

import type { ParsingState } from "../state";
import type { ParjsCombinator } from "../../";
import { ParjserBase } from "../parser";
import { defineCombinator } from "./combinator";

/**
 * Applies the source parser. If it succeeds, backtracks to the current position in the input
 * and yields the result.
 */
export function backtrack<T>(): ParjsCombinator<T, T> {
    return defineCombinator<T, T>(source => {
        return new (class Backtrack extends ParjserBase<T> {
            type = "backtrack";
            expecting = source.expecting;

            _apply(ps: ParsingState): void {
                const { position } = ps;
                source.apply(ps);
                if (ps.isOk) {
                    // if inner succeeded, we backtrack.
                    ps.position = position;
                }
                // whatever code ps had, we return it.
            }
        })();
    });
}
