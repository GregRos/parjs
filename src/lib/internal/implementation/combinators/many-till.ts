/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {Issues} from "../issues";
import {ParsingState} from "../state";
import {ReplyKind} from "../../../reply";
import {ImplicitLoudParser, ParjsCombinator} from "../../../";
import {LoudParser} from "../../../loud";
import {rawCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";
import {ConversionHelper} from "../../convertible-literal";

export function manyTill<T>(till: ImplicitLoudParser<any>, tillOptional?: boolean)
    : ParjsCombinator<LoudParser<T>, LoudParser<T[]>>;
export function manyTill(till: ImplicitLoudParser<any>, tillOptional?: boolean) {
    let tillResolved = ConversionHelper.convert(till) as any as BaseParjsParser;
    return rawCombinator(source => {
        return new class ManyTill extends BaseParjsParser {
            displayName = "manyTill";
            expecting = `${source.expecting} or ${tillResolved.expecting}`;

            protected _apply(ps: ParsingState): void {
                let {position} = ps;
                let arr = [];
                let successes = 0;
                while (true) {
                    tillResolved.apply(ps);
                    if (ps.isOk) {
                        break;
                    } else if (ps.atLeast(ReplyKind.HardFail)) {
                        //if till failed hard/fatally, we return the fail result.
                        return;
                    }
                    //backtrack to before till failed.
                    ps.position = position;
                    source.apply(ps);
                    if (ps.isOk) {
                        arr.push(ps.value);
                    } else if (ps.isSoft) {
                        //many failed softly before till...
                        if (!tillOptional) {
                            //if we parsed at least one element, we fail hard.
                            ps.kind = successes === 0 ? ReplyKind.SoftFail : ReplyKind.HardFail;
                            return;
                        } else {
                            //till was optional, so many failing softly is OK.
                            break;
                        }
                    } else {
                        //many failed hard/fatal
                        return;
                    }
                    if (ps.position === position) {
                        Issues.guardAgainstInfiniteLoop("manyTill");
                    }
                    position = ps.position;
                    successes++;
                }
                ps.value = arr;
                ps.kind = ReplyKind.Ok;
            }

        }();
    });
}
