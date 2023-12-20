/**
 * @module parjs/combinators
 */
/** */

import { Issues } from "../issues";
import type { ParsingState, UserState } from "../state";
import { ResultKind } from "../result";
import type { ImplicitParjser, ParjsCombinator } from "../../index";
import { defineCombinator, pipe } from "./combinator";
import { ParjserBase } from "../parser";
import { ScalarConverter } from "../scalar-converter";
import { qthen } from "./then";

const defaultProjection = <TSource>(sourceMatches: TSource[]) => sourceMatches;

/**
 * Tries to apply the source parser repeatedly until `till` succeeds. Yields
 * the results of the source parser in an array.
 * @param till The parser that indicates iteration should stop.
 * @param projection Optionally, a projection to apply on the captured results.
 */
export function manyTill<TSource, TTill, TResult = TSource[]>(
    till: ImplicitParjser<TTill>,
    pProject?: (source: TSource[], till: TTill, user: UserState) => TResult
): ParjsCombinator<TSource, TResult> {
    const tillResolved = ScalarConverter.convert(till) as ParjserBase<TTill>;
    const project = pProject || defaultProjection;
    return defineCombinator<TSource, TResult>(source => {
        return new (class ManyTill extends ParjserBase<TResult> {
            type = "manyTill";
            expecting = `${source.expecting} or ${tillResolved.expecting}`;

            _apply(ps: ParsingState): void {
                let { position } = ps;
                const arr: TSource[] = [];
                let successes = 0;
                for (;;) {
                    tillResolved.apply(ps);
                    if (ps.isOk) {
                        break;
                    } else if (ps.atLeast(ResultKind.HardFail)) {
                        // if till failed hard/fatally, we return the fail result.
                        return;
                    }
                    // backtrack to before till failed.
                    ps.position = position;
                    source.apply(ps);
                    if (ps.isOk) {
                        arr.push(ps.value as TSource);
                    } else if (ps.isSoft) {
                        // many failed softly before till...
                        ps.kind = successes === 0 ? ResultKind.SoftFail : ResultKind.HardFail;
                        return;
                    } else {
                        // many failed hard/fatal
                        return;
                    }
                    if (ps.position === position) {
                        Issues.guardAgainstInfiniteLoop("manyTill");
                    }
                    position = ps.position;
                    successes++;
                }
                ps.value = project(arr, ps.value as TTill, ps.userState);
                ps.kind = ResultKind.Ok;
            }
        })();
    });
}

/**
 * Applies `start` and then repeatedly applies the source parser until
 * `pTill` succeeds. Similar to a mix of `between` and `manyTill`. Yields the
 * results of the source parser in an array.
 * @param start The initial parser to apply.
 * @param pTill Optionally, the terminator. Defaults to `start`.
 * @param projection Optionally, a projection to apply on the captured results.
 */
export function manyBetween<TSource, TStart, TTill = TStart, TResult = TSource[]>(
    start: ImplicitParjser<TStart>,
    pTill?: ImplicitParjser<TTill>,
    projection?: (sources: TSource[], till: TTill | TStart, state: UserState) => TResult
): ParjsCombinator<TSource, TResult> {
    const till: ImplicitParjser<TTill | TStart> = pTill || start;
    return defineCombinator(source => {
        return pipe(start, qthen(source.pipe(manyTill(till, projection))));
    });
}
