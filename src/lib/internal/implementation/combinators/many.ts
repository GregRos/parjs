/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {Issues} from "../../issues";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {ArrayHelpers} from "../../functions/helpers";
import {ParjsCombinator} from "../../../../loud-combinators";
import {LoudParser} from "../../../../loud";
import {QuietParser} from "../../../../quiet";
import {rawCombinator} from "../combinator";
import {BaseParjsParser} from "../../parser";

export function many<T>(minSuccess?: number, maxIterations?: number)
    : ParjsCombinator<LoudParser<T>, LoudParser<T[]>>;
export function many(minSuccess?: number, maxIterations?: number)
    : ParjsCombinator<QuietParser, QuietParser>;
export function many(minSuccess?: number, maxIterations?: number) {
    return rawCombinator(source => {
        return new class Many extends BaseParjsParser {
            displayName = "many";
            expecting = source.expecting;
            isLoud = source.isLoud;

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
                    ArrayHelpers.maybePush(arr, ps.value);
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
