/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {Issues} from "../issues";
import {ReplyKind} from "../../../reply";
import {ParsingState} from "../state";
import {ImplicitLoudParser, ParjsCombinator} from "../../../";
import {LoudParser} from "../../../loud";
import {ConversionHelper} from "../../convertible-literal";
import {BaseParjsParser} from "../parser";
import {rawCombinator} from "./combinator";

export function manySepBy<T>(delimeter: ImplicitLoudParser<any>, max?: number)
    : ParjsCombinator<LoudParser<T>, LoudParser<T[]>>;

export function manySepBy(implDelimeter: ImplicitLoudParser<any>, max = Infinity) {
    let delimeter = ConversionHelper.convert(implDelimeter) as any as BaseParjsParser;
    return rawCombinator(source => {
        return new class extends BaseParjsParser {
            displayName = "manySepBy";
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
