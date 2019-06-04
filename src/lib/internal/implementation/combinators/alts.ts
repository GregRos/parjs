/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {Issues} from "../../issues";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {ImplicitAnyParser, ImplicitLoudParser} from "../../../../convertible-literal";
import {ParjsCombinator} from "../../../../loud-combinators";
import {LoudParser} from "../../../../loud";
import {QuietParser} from "../../../../quiet";
import {ConversionHelper} from "../../../convertible-literal";
import {rawCombinator} from "../combinator";
import {BaseParjsParser} from "../../parser";
import {AnyParser} from "../../../../any";

export function or<T1, T2>(alt2: ImplicitLoudParser<T2>): ParjsCombinator<LoudParser<T1>, LoudParser<T1 | T2>>;
export function or(alt2: ImplicitAnyParser): ParjsCombinator<QuietParser, QuietParser>;
export function or(...alts: ImplicitAnyParser[]) {
    let resolvedAlts = alts.map(x => ConversionHelper.convert(x) as any as BaseParjsParser);
    return rawCombinator(source => {
        if (resolvedAlts.some(x => x.isLoud !== source.isLoud)) {
            Issues.mixedLoudnessNotPermitted("or");
        }
        resolvedAlts.splice(0, 0, source);

        let altNames = resolvedAlts.map(x => x.displayName);
        return new class Or extends BaseParjsParser {
            displayName = "or";
            expecting = `one of: ${altNames.join(", ")}`;
            isLoud = source.isLoud;
            protected _apply(ps: ParsingState): void {
                let {position} = ps;
                for (let i = 0; i < resolvedAlts.length; i++) {
                    //go over each alternative.
                    let cur = resolvedAlts[i];
                    //apply it on the current state.
                    cur.apply(ps);
                    if (ps.isOk) {
                        //if success, return. The PS records the result.
                        return;
                    } else if (ps.isSoft) {
                        //backtrack to the original position and try again.
                        ps.position = position;
                    } else {
                        //if failure, return false,
                        return;
                    }
                }
                ps.kind = ReplyKind.SoftFail;
            }

        }();
    });
}
