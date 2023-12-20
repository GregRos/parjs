/**
 * @module parjs/combinators
 */
/** */

import { Issues } from "../issues";
import type { ParsingState } from "../state";
import { ResultKind } from "../result";
import type { ParjsCombinator } from "../../index";
import { defineCombinator } from "./combinator";
import { ParjserBase } from "../parser";

/**
 * Applies the source parser until it fails softly, and yields all of its results
 * in an array.
 * @param maxIterations Optionally, the maximum number of times to apply
 * the source parser. Defaults to `Infinity`.
 */
export function many<T>(maxIterations?: number): ParjsCombinator<T, T[]>;

export function many<T>(maxIterations = Infinity) {
    return defineCombinator(source => {
        return new (class Many extends ParjserBase<T[]> {
            type = "many";
            expecting = source.expecting;

            _apply(ps: ParsingState): void {
                let { position } = ps;
                const arr = [] as unknown[];
                let i = 0;
                for (;;) {
                    source.apply(ps);
                    if (!ps.isOk) break;
                    if (i >= maxIterations) break;
                    if (maxIterations === Infinity && ps.position === position) {
                        Issues.guardAgainstInfiniteLoop("many");
                    }
                    position = ps.position;
                    arr.push(ps.value);
                    i++;
                }
                if (ps.atLeast(ResultKind.HardFail)) {
                    return;
                }
                ps.value = arr;
                // recover from the last failure.
                ps.position = position;
                ps.kind = ResultKind.Ok;
            }
        })();
    });
}
