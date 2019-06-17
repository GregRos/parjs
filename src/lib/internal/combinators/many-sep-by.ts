/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {Issues} from "../issues";
import {ResultKind} from "../reply";
import {ParsingState} from "../state";
import {ImplicitParjser, ParjsCombinator} from "../../index";
import {ScalarConverter} from "../scalar-converter";
import {ParjserBase} from "../parser";
import {defineCombinator} from "./combinator";

/**
 * Applies the source parser repeatedly until it fails softly, with each pair of
 * applications separated by applying `delimeter`. Also terminates if `delimeter`
 * fails softly. Yields all the results of the source parser in an array.
 * @param delimeter Parser that separates two applications of the source.
 * @param max Optionally, then maximum number of times to apply the source
 * parser. Defaults to `Infinity`.
 */
export function manySepBy<T>(delimeter: ImplicitParjser<any>, max?: number)
    : ParjsCombinator<T, T[]>;

export function manySepBy(implDelimeter: ImplicitParjser<any>, max = Infinity) {
    let delimeter = ScalarConverter.convert(implDelimeter) as any as ParjserBase;
    return defineCombinator(source => {
        return new class extends ParjserBase {
            type = "manySepBy";
            expecting = source.expecting;

            _apply(ps: ParsingState): void {
                let arr = [];
                source.apply(ps);
                if (ps.atLeast(ResultKind.HardFail)) {
                    return;
                } else if (ps.isSoft) {
                    ps.value = [];
                    ps.kind = ResultKind.Ok;
                    return;
                }
                let {position} = ps;
                arr.push(ps.value);
                let i = 1;
                while (true) {
                    if (i >= max) break;
                    delimeter.apply(ps);
                    if (ps.isSoft) {
                        break;
                    } else if (ps.atLeast(ResultKind.HardFail)) {
                        return;
                    }

                    source.apply(ps);
                    if (ps.isSoft) {
                        break;
                    } else if (ps.atLeast(ResultKind.HardFail)) {
                        return;
                    }
                    if (max >= Infinity && ps.position === position) {
                        Issues.guardAgainstInfiniteLoop("many");
                    }
                    arr.push(ps.value);
                    position = ps.position;
                    i++;
                }
                ps.kind = ResultKind.Ok;
                ps.position = position;
                ps.value = arr;
            }
        }();
    });
}
