/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {Issues} from "../issues";
import {ParsingState} from "../state";
import {ReplyKind} from "../../../reply";
import {ParjsCombinator} from "../../../";
import {LoudParser} from "../../../loud";
import {rawCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";

export function many<T>(minSuccess?: number, maxIterations?: number)
    : ParjsCombinator<LoudParser<T>, LoudParser<T[]>>;

export function many(minSuccess = -1, maxIterations = Infinity) {
    maxIterations >= minSuccess || Issues.willAlwaysFail("many");
    return rawCombinator(source => {
        return new class Many extends BaseParjsParser {
            displayName = "many";
            expecting = source.expecting;

            _apply(ps: ParsingState): void {
                let {position} = ps;
                let arr = [];
                let i = 0;
                while (true) {
                    source.apply(ps);
                    if (!ps.isOk) break;
                    if (i >= maxIterations) break;
                    if (maxIterations === Infinity && ps.position === position) {
                        Issues.guardAgainstInfiniteLoop("many");
                    }
                    position = ps.position;
                    arr.push(ps.value);
                    i++;
                }
                if (ps.atLeast(ReplyKind.HardFail)) {
                    return;
                }
                if (i < minSuccess) {
                    ps.kind = i === 0 ? ReplyKind.SoftFail : ReplyKind.HardFail;
                    return;
                }
                ps.value = arr;
                //recover from the last failure.
                ps.position = position;
                ps.kind = ReplyKind.Ok;
            }

        }();
    });
}
