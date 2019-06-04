/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {ReplyKind} from "../../../../reply";
import {ParsingState} from "../../state";
import {AnyParserAction} from "../../../action";
import {ArrayHelpers} from "../../functions/helpers";
import {QuietParser} from "../../../../quiet";
import {ParjsCombinator} from "../../../../loud-combinators";
import {LoudParser} from "../../../../loud";
import {ImplicitAnyParser, ImplicitLoudParser} from "../../../../convertible-literal";
import {AnyParser} from "../../../../any";
import {rawCombinator} from "../combinator";
import {BaseParjsParser} from "../../parser";
import {ConversionHelper} from "../../../convertible-literal";

export function then<T>(second?: QuietParser)
    : ParjsCombinator<LoudParser<T>, LoudParser<T>>;
export function then(second?: QuietParser)
    : ParjsCombinator<QuietParser, QuietParser>;
export function then<T1, T2>(second?: ImplicitLoudParser<T2>)
    : ParjsCombinator<LoudParser<T1>, LoudParser<[T1, T2]>>;
export function then<T1, T2, T3>(second?: ImplicitLoudParser<T2>, third: ImplicitLoudParser<T3>)
    : ParjsCombinator<LoudParser<T1>, LoudParser<[T1, T2, T3]>>;
export function then(...parsers: ImplicitAnyParser[]) {
    let resolvedParsers = parsers.map(x => ConversionHelper.convert(x) as any as BaseParjsParser);
    return rawCombinator(source => {
        resolvedParsers.splice(0, 0, source);

        return new class Then extends BaseParjsParser {
            displayName = "then";
            expecting = source.expecting;
            isLoud = resolvedParsers.some(x => x.isLoud);

            protected _apply(ps: ParsingState): void {
                let results = [];
                let origPos = ps.position;
                for (let i = 0; i < resolvedParsers.length; i++) {
                    let cur = resolvedParsers[i];
                    cur.apply(ps);
                    if (ps.isOk) {
                        ArrayHelpers.maybePush(results, ps.value);
                    } else if (ps.isSoft && origPos === ps.position) {
                        //if the first parser failed softly then we propagate a soft failure.
                        return;
                    } else if (ps.isSoft) {
                        ps.kind = ReplyKind.HardFail;
                        //if a i > 0 parser failed softly, this is a hard fail for us.
                        //also, propagate the internal expectation.
                        return;
                    } else {
                        //ps failed hard or fatally. The same severity.
                        return;
                    }
                }
                ps.value = results;
                ps.kind = ReplyKind.Ok;
            }

        }();
    });
}
