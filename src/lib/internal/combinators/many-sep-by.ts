/**
 * @module parjs/combinators
 */
/** */

import type { ImplicitParjser, ParjsCombinator } from "../../index";
import { Issues } from "../issues";
import { ParjserBase } from "../parser";
import { ResultKind } from "../result";
import { ScalarConverter } from "../scalar-converter";
import type { ParsingState } from "../state";
import { defineCombinator } from "./combinator";

export type ArrayWithSeparators<Normal, Separator> = Normal[] & {
    separators: Separator[];
};

export function getArrayWithSeparators<T, S>(
    things: T[],
    separators: S[]
): ArrayWithSeparators<T, S> {
    const array = things as ArrayWithSeparators<T, S>;
    array.separators = separators;
    return array;
}

/**
 * Applies the source parser repeatedly until it fails softly, with each pair of
 * applications separated by applying `delimeter`. Also terminates if `delimeter`
 * fails softly. Yields all the results of the source parser in an array.
 * @param delimeter Parser that separates two applications of the source.
 * @param max Optionally, then maximum number of times to apply the source
 * parser. Defaults to `Infinity`.
 * @template E The type of the source parser.
 * @template Sep The type of the delimeter (separator) parser.
 */
export function manySepBy<E, Sep>(
    delimeter: ImplicitParjser<Sep>,
    max?: number
): ParjsCombinator<E, ArrayWithSeparators<E, Sep>>;

export function manySepBy<E, Sep>(implDelimeter: ImplicitParjser<Sep>, max = Infinity) {
    const delimeter = ScalarConverter.convert(implDelimeter) as ParjserBase<Sep>;
    return defineCombinator<E, E>(source => {
        return new (class extends ParjserBase<E> {
            type = "manySepBy";
            expecting = source.expecting;

            _apply(ps: ParsingState): void {
                const results: ArrayWithSeparators<E, Sep> = getArrayWithSeparators<E, Sep>([], []);

                source.apply(ps);
                if (ps.atLeast(ResultKind.HardFail)) {
                    return;
                } else if (ps.isSoft) {
                    ps.value = results;
                    ps.kind = ResultKind.Ok;
                    return;
                }
                let { position } = ps;
                results.push(ps.value as E);
                let i = 1;
                for (;;) {
                    if (i >= max) break;
                    delimeter.apply(ps);
                    if (ps.isSoft) {
                        break;
                    } else if (ps.atLeast(ResultKind.HardFail)) {
                        return;
                    }
                    results.separators.push(ps.value as Sep);
                    source.apply(ps);
                    if (ps.isSoft) {
                        break;
                    } else if (ps.atLeast(ResultKind.HardFail)) {
                        return;
                    }
                    if (max >= Infinity && ps.position === position) {
                        Issues.guardAgainstInfiniteLoop("manySepBy");
                    }
                    results.push(ps.value as E);
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
