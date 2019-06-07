/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {Issues} from "../issues";
import {ParsingState} from "../state";
import {ReplyKind} from "../../../reply";
import {ImplicitLoudParser} from "../../../convertible-literal";
import {ParjsCombinator} from "../../../";
import {LoudParser} from "../../../loud";
import {ConversionHelper} from "../convertible-literal";
import {rawCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";


/**
 * Basic disjunction/alternatives combinator. Tries to apply one or more parsers in sequence,
 * until one succeeds or fails hard.
 * @param alt2 An alternative parser to apply.
 */
export function or<T1, T2>(
    alt2: ImplicitLoudParser<T2>
): ParjsCombinator<LoudParser<T1>, LoudParser<T1 | T2>>;

export function or<T1, T2, T3>(
    alt2: ImplicitLoudParser<T2>,
    alt3: ImplicitLoudParser<T3>
): ParjsCombinator<LoudParser<T1>, LoudParser<T1 | T2 | T3>>;


export function or<T1, T2, T3, T4>(
    alt2: ImplicitLoudParser<T2>,
    alt3: ImplicitLoudParser<T3>,
    alt4: ImplicitLoudParser<T4>
): ParjsCombinator<LoudParser<T1>, LoudParser<T1 | T2 | T3 | T4>>;
export function or<T1, T2, T3, T4, T5>(
    alt2: ImplicitLoudParser<T2>,
    alt3: ImplicitLoudParser<T3>,
    alt4: ImplicitLoudParser<T4>,
    alt5: ImplicitLoudParser<T5>
): ParjsCombinator<LoudParser<T1>, LoudParser<T1 | T2 | T3 | T4 | T5>>;
export function or(...alts: ImplicitLoudParser<any>[]) {
    let resolvedAlts = alts.map(x => ConversionHelper.convert(x) as any as BaseParjsParser);
    return rawCombinator(source => {
        resolvedAlts.splice(0, 0, source);

        let altNames = resolvedAlts.map(x => x.displayName);
        return new class Or extends BaseParjsParser {
            displayName = "or";
            expecting = `one of: ${altNames.join(", ")}`;
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
