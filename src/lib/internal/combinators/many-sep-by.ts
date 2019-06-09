/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {Issues} from "../issues";
import {ReplyKind} from "../../reply";
import {ParsingState} from "../state";
import {ImplicitLoudParser, ParjsCombinator} from "../../index";
import {Parjser} from "../../loud";
import {LiteralConverter} from "../literal-conversion";
import {BaseParjsParser} from "../parser";
import {defineCombinator} from "./combinator";

/**
 * Applies the source parser repeatedly until it fails softly, with each pair of
 * applications separated by applying `delimeter`. Also terminates if `delimeter`
 * fails softly. Yields all the results of the source parser in an array.
 * @param delimeter Parser that separates two applications of the source.
 * @param max Optionally, then maximum number of times to apply the source
 * parser. Defaults to `Infinity`.
 */
export function manySepBy<T>(delimeter: ImplicitLoudParser<any>, max?: number)
    : ParjsCombinator<T, T[]>;

export function manySepBy(implDelimeter: ImplicitLoudParser<any>, max = Infinity) {
    let delimeter = LiteralConverter.convert(implDelimeter) as any as BaseParjsParser;
    return defineCombinator(source => {
        return new class extends BaseParjsParser {
            type = "manySepBy";
            expecting = source.expecting;

            _apply(ps: ParsingState): void {
                let arr = [];
                source.apply(ps);
                if (ps.atLeast(ReplyKind.HardFail)) {
                    return;
                } else if (ps.isSoft) {
                    ps.value = [];
                    ps.kind = ReplyKind.Ok;
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
                    } else if (ps.atLeast(ReplyKind.HardFail)) {
                        return;
                    }

                    source.apply(ps);
                    if (ps.isSoft) {
                        break;
                    } else if (ps.atLeast(ReplyKind.HardFail)) {
                        return;
                    }
                    if (max >= Infinity && ps.position === position) {
                        Issues.guardAgainstInfiniteLoop("many");
                    }
                    arr.push(ps.value);
                    position = ps.position;
                    i++;
                }
                ps.kind = ReplyKind.Ok;
                ps.position = position;
                ps.value = arr;
            }
        }();
    });
}
