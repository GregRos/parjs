/**
 * @module parjs/combinators
 */
/** */

import {Issues} from "../issues";
import {ParsingState, UserState} from "../state";
import {ResultKind} from "../result";
import {ImplicitParjser, ParjsCombinator} from "../../index";
import {defineCombinator, pipe} from "./combinator";
import {ParjserBase} from "../parser";
import {ScalarConverter} from "../scalar-converter";
import {qthen} from "./then";

const defaultProjection = (sourceMatches, tillMatch, userState) => sourceMatches;

/**
 * Tries to apply the source parser repeatedly until `till` succeeds. Yields
 * the results of the source parser in an array.
 * @param till The parser that indicates iteration should stop.
 * @param project
 * fails softly. Defaults to false.
 */
export function manyTill<TSource, TTill = any, TResult = TSource[]>(
    till: ImplicitParjser<TTill>,
    project?: (source: TSource[], till: TTill, user: UserState) => TResult
): ParjsCombinator<TSource, TResult>;
export function manyTill(
    till: ImplicitParjser<any>,
    pProject?: (source: any[], till: any, user: UserState) => any
) {
    let tillResolved = ScalarConverter.convert(till) as any as ParjserBase;
    let project = pProject || defaultProjection;
    return defineCombinator(source => {
        return new class ManyTill extends ParjserBase {
            type = "manyTill";
            expecting = `${source.expecting} or ${tillResolved.expecting}`;

            _apply(ps: ParsingState): void {
                let {position} = ps;
                let arr = [] as any[];
                let successes = 0;
                while (true) {
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
                        arr.push(ps.value);
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
                ps.value = project(arr, ps.value, ps.userState);
                ps.kind = ResultKind.Ok;
            }

        }();
    });
}

/**
 * Applies `start` and then repeatedly applies the source parser until
 * `pTill` succeeds. Similar to a mix of `between` and `manyTill`.
 * @param start The initial parser to apply.
 * @param pTill The terminator.
 * @param projection Optionally, a projection to apply on the captured results.
 */
export function manyBetween<TSource, TTill = any, TResult = TSource[]>(
    start: ImplicitParjser<any>,
    pTill?: ImplicitParjser<TTill>,
    projection?: (sources: TSource[], till: TTill, state: UserState) => TResult
): ParjsCombinator<TSource, TResult> {
    let till = pTill || start;
    return defineCombinator(source => {
        return pipe(
            start,
            qthen(
                source.pipe(
                    manyTill(till, projection)
                )
            )
        );
    });
}
