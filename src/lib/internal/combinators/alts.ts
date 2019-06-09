/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ParsingState} from "../state";
import {ReplyKind} from "../../reply";
import {ParjsCombinator} from "../..";
import {ImplicitLoudParser, LiteralConverter} from "../literal-conversion";
import {defineCombinator} from "./combinator";
import {ParjserBase} from "../parser";


/**
 * Applies the source parser. If it fails softly, applies `alt2` at the current
 * position. Yields the result of the successful parser.
 * @param alt2 An alternative parser to apply.
 */
export function or<T1, T2>(
    alt2: ImplicitLoudParser<T2>
): ParjsCombinator<T1, T1 | T2>;

export function or<T1, T2, T3>(
    alt2: ImplicitLoudParser<T2>,
    alt3: ImplicitLoudParser<T3>
): ParjsCombinator<T1, T1 | T2 | T3>;


export function or<T1, T2, T3, T4>(
    alt2: ImplicitLoudParser<T2>,
    alt3: ImplicitLoudParser<T3>,
    alt4: ImplicitLoudParser<T4>
): ParjsCombinator<T1, T1 | T2 | T3 | T4>;
export function or<T1, T2, T3, T4, T5>(
    alt2: ImplicitLoudParser<T2>,
    alt3: ImplicitLoudParser<T3>,
    alt4: ImplicitLoudParser<T4>,
    alt5: ImplicitLoudParser<T5>
): ParjsCombinator<T1, T1 | T2 | T3 | T4 | T5>;
export function or(...alts: ImplicitLoudParser<any>[]) {
    let resolvedAlts = alts.map(x => LiteralConverter.convert(x) as any as ParjserBase);
    return defineCombinator(source => {
        resolvedAlts.splice(0, 0, source);

        let altNames = resolvedAlts.map(x => x.type);
        return new class Or extends ParjserBase {
            type = "or";
            expecting = `one of: ${altNames.join(", ")}`;
            _apply(ps: ParsingState): void {
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
