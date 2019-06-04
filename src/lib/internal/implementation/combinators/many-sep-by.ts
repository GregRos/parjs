/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {Issues} from "../../issues";
import {ReplyKind} from "../../../../reply";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ArrayHelpers} from "../../functions/helpers";
import {ImplicitAnyParser} from "../../../../convertible-literal";
import {ParjsCombinator} from "../../../../loud-combinators";
import {LoudParser} from "../../../../loud";
import {QuietParser} from "../../../../quiet";
import {ConversionHelper} from "../../../convertible-literal";
import {BaseParjsParser} from "../../parser";
import {rawCombinator} from "../combinator";

export function manySepBy<T>(delimeter: ImplicitAnyParser, max?: number)
    : ParjsCombinator<LoudParser<T>, LoudParser<T[]>>;
export function manySepBy<T>(delimeter: ImplicitAnyParser, max?: number)
    : ParjsCombinator<QuietParser, QuietParser>;
export function manySepBy(implDelimeter: ImplicitAnyParser, max = Infinity) {
    let delimeter = ConversionHelper.convert(implDelimeter) as any as BaseParjsParser;
    return rawCombinator(source => {
        return new class extends BaseParjsParser {
            displayName = "manySepBy";
            expecting = source.expecting;
            isLoud = source.isLoud;

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
                ArrayHelpers.maybePush(arr, ps.value);
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
                    ArrayHelpers.maybePush(arr, ps.value);
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
