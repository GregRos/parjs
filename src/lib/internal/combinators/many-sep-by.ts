/**
 * @module parjs/combinators
 */
/** */

import { Issues } from "../issues";
import { ResultKind } from "../result";
import { ParsingState } from "../state";
import { ImplicitParjser, ParjsCombinator, Parjser } from "../../index";
import { ScalarConverter } from "../scalar-converter";
import { ParjserBase } from "../parser";
import { defineCombinator } from "./combinator";

export type ArrayWithSeparators<Normal, Separator> = Normal[] & {
    separators: Separator[];
};

export function getArrayWithSeparators<T, S>(arr: T[], separators: S[]): ArrayWithSeparators<T, S> {
    (arr as any).separators = separators;
    return arr as any;
}

/**
 * Applies the source parser repeatedly until it fails softly, with each pair of
 * applications separated by applying `delimeter`. Also terminates if `delimeter`
 * fails softly. Yields all the results of the source parser in an array.
 * @param delimeter Parser that separates two applications of the source.
 * @param max Optionally, then maximum number of times to apply the source
 * parser. Defaults to `Infinity`.
 */
export function manySepBy<E, S>(
    delimeter: ImplicitParjser<S>,
    max?: number
): ParjsCombinator<E, ArrayWithSeparators<E, S>>;

export function manySepBy<E, S>(implDelimeter: ImplicitParjser<S>, max = Infinity) {
    const delimeter = ScalarConverter.convert(implDelimeter) as ParjserBase & Parjser<S>;
    return defineCombinator<E>(source => {
        return new (class extends ParjserBase {
            type = "manySepBy";
            expecting = source.expecting;

            _apply(ps: ParsingState): void {
                const results = getArrayWithSeparators<E, S>([], []);

                source.apply(ps);
                if (ps.atLeast(ResultKind.HardFail)) {
                    return;
                } else if (ps.isSoft) {
                    ps.value = results;
                    ps.kind = ResultKind.Ok;
                    return;
                }
                let { position } = ps;
                results.push(ps.value);
                let i = 1;
                for (;;) {
                    if (i >= max) break;
                    delimeter.apply(ps);
                    if (ps.isSoft) {
                        break;
                    } else if (ps.atLeast(ResultKind.HardFail)) {
                        return;
                    }
                    results.separators.push(ps.value);
                    source.apply(ps);
                    if (ps.isSoft) {
                        break;
                    } else if (ps.atLeast(ResultKind.HardFail)) {
                        return;
                    }
                    if (max >= Infinity && ps.position === position) {
                        Issues.guardAgainstInfiniteLoop("many");
                    }
                    results.push(ps.value);
                    position = ps.position;
                    i++;
                }
                ps.kind = ResultKind.Ok;
                ps.position = position;
                ps.value = results;
            }
        })();
    });
}
