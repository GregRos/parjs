/**
 * @module parjs/combinators
 */
/** */

import { ResultKind } from "../result";
import type { ParsingState } from "../state";
import type { ImplicitParjser, ParjsCombinator } from "../../index";

import { composeCombinator, defineCombinator } from "./combinator";
import { ParjserBase } from "../parser";
import { ScalarConverter } from "../scalar-converter";
import { map } from "./map";

/**
 * Applies the source parser followed by `next`. Yields the result of
 * `next`.
 * @param next
 */
export function qthen<T>(next: ImplicitParjser<T>): ParjsCombinator<unknown, T> {
    return composeCombinator(
        then(next),
        map(arr => arr[1])
    );
}

/**
 * Applies the source parser followed by `next`. Yields the result of
 * the source parser.
 * @param next
 */
export function thenq<T>(next: ImplicitParjser<unknown>): ParjsCombinator<T, T> {
    return composeCombinator(
        then(next),
        map(arr => arr[0])
    );
}

/**
 * Applies the source parser followed by `next`. Yields the results of
 * both in an array.
 * @param next
 */
export function then<A, B>(next: ImplicitParjser<B>): ParjsCombinator<A, [A, B]>;

/**
 * Applies the source parser, followed by `next1` and then `next2`. Yields the
 * results of all in an array.
 * @param next1 The 2nd parser to apply.
 * @param next2 The 3rd parser to apply.
 */
export function then<A, B, C>(
    next1: ImplicitParjser<B>,
    next2: ImplicitParjser<C>
): ParjsCombinator<A, [A, B, C]>;

/**
 * Applies the source parser, followed by three other parsers. Yields the
 * results of all in an array.
 * @param next1 The 2nd parser to apply.
 * @param next2 The 3rd parser to apply.
 * @param next3 The 4th parser to apply.
 */
export function then<A, B, C, D>(
    next1: ImplicitParjser<B>,
    next2: ImplicitParjser<C>,
    next3: ImplicitParjser<D>
): ParjsCombinator<A, [A, B, C, D]>;

/**
 * Applies the source parser, followed by four other parsers. Yields the results
 * of all in an array.
 * @param next1 The 2nd parser to apply.
 * @param next2 The 3rd parser to apply.
 * @param next3 The 4th parser to apply.
 * @param next4 The 5th parser to apply.
 */
export function then<A, B, C, D, E>(
    next1: ImplicitParjser<B>,
    next2: ImplicitParjser<C>,
    next3: ImplicitParjser<D>,
    next4: ImplicitParjser<E>
): ParjsCombinator<A, [A, B, C, D, E]>;

export function then(...parsers: ImplicitParjser<unknown>[]) {
    const resolvedParsers = parsers.map(x => ScalarConverter.convert(x) as ParjserBase<unknown>);
    return defineCombinator(source => {
        resolvedParsers.splice(0, 0, source);

        return new (class Then extends ParjserBase<unknown[]> {
            type = "then";
            expecting = source.expecting;

            _apply(ps: ParsingState): void {
                const results = [] as unknown[];
                const origPos = ps.position;
                // for loop might be very slightly more performant
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let i = 0; i < resolvedParsers.length; i++) {
                    const cur = resolvedParsers[i];
                    cur.apply(ps);
                    if (ps.isOk) {
                        results.push(ps.value);
                    } else if (ps.isSoft && origPos === ps.position) {
                        // if the first parser failed softly then we propagate a soft failure.
                        return;
                    } else if (ps.isSoft) {
                        ps.kind = ResultKind.HardFail;
                        // if a i > 0 parser failed softly, this is a hard fail for us.
                        // also, propagate the internal expectation.
                        return;
                    } else {
                        // ps failed hard or fatally. The same severity.
                        return;
                    }
                }
                ps.value = results;
                ps.kind = ResultKind.Ok;
            }
        })();
    });
}
