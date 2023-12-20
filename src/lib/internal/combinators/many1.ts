/**
 * @module parjs/combinators
 */
/** */

import type { ParjsCombinator } from "../../index";
import { Issues } from "../issues";
import { ParjserBase } from "../parser";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";
import { defineCombinator } from "./combinator";

/**
 * Applies the source parser 1 or more times until it fails softly. Yields all
 * of its results in an array.
 * @param maxIterations Optionally, the maximum number of times to apply
 * the source parser. Defaults to `Infinity`.
 */
export function many1<T>(maxIterations?: number): ParjsCombinator<T, T[]>;

export function many1<T>(maxIterations = Infinity) {
    return defineCombinator(source => {
        return new (class Many1 extends ParjserBase<T[]> {
            type = "many1";
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
                        Issues.guardAgainstInfiniteLoop(this.type);
                    }
                    position = ps.position;
                    arr.push(ps.value);
                    i++;
                }
                if (ps.atLeast(ResultKind.HardFail)) {
                    return;
                }

                if (i === 0) {
                    ps.kind = ResultKind.SoftFail;
                    ps.reason = "expected at least one match";
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
