/**
 * @module parjs/combinators
 */
/** */

import { ParsingState } from "../state";
import { ResultKind } from "../result";
import { ParjsCombinator } from "../..";
import { ImplicitParjser, ScalarConverter } from "../scalar-converter";
import { defineCombinator } from "./combinator";
import { ParjserBase } from "../parser";

/**
 * Applies the source parser. If it fails softly, will try to apply the
 * given parsers in sequential order. If all fail, parsing will fail with the
 * error of the last parser.
 * This combinator cannot recover from Hard or Fatal failures. If any parser
 * fails in that way, the returned parser will fail with that info and will not
 * try other parsers.
 *
 * @param alt1 The first alternative parser to apply.
 */
export function or<T1, T2>(alt1: ImplicitParjser<T2>): ParjsCombinator<T1, T1 | T2>;

/**
 * Applies the source parser. If it fails softly, will try to apply the
 * given parsers in sequential order. If all fail, parsing will fail with the
 * error of the last parser.
 * This combinator cannot recover from Hard or Fatal failures. If any parser
 * fails in that way, the returned parser will fail with that info and will not
 * try other parsers.
 *
 * @param alt1 The first alternative parser to apply.
 * @param alt2 The second alternative parser to apply.
 */
export function or<T1, T2, T3>(
    alt1: ImplicitParjser<T2>,
    alt2: ImplicitParjser<T3>
): ParjsCombinator<T1, T1 | T2 | T3>;

/**
 * Applies the source parser. If it fails softly, will try to apply the
 * given parsers in sequential order. If all fail, parsing will fail with the
 * error of the last parser.
 * This combinator cannot recover from Hard or Fatal failures. If any parser
 * fails in that way, the returned parser will fail with that info and will not
 * try other parsers.
 *
 * @param alt1 The first alternative parser to apply.
 * @param alt2 The second alternative parser to apply.
 * @param alt3 The third alternative parser to apply.
 */
export function or<T1, T2, T3, T4>(
    alt1: ImplicitParjser<T2>,
    alt2: ImplicitParjser<T3>,
    alt3: ImplicitParjser<T4>
): ParjsCombinator<T1, T1 | T2 | T3 | T4>;

/**
 * Applies the source parser. If it fails softly, will try to apply the
 * given parsers in sequential order. If all fail, parsing will fail with the
 * error of the last parser.
 * This combinator cannot recover from Hard or Fatal failures. If any parser
 * fails in that way, the returned parser will fail with that info and will not
 * try other parsers.
 *
 * @param alt1 The first alternative parser to apply.
 * @param alt2 The second alternative parser to apply.
 * @param alt3 The third alternative parser to apply.
 * @param alt4 The fourth alternative parser to apply.
 */
export function or<T1, T2, T3, T4, T5>(
    alt1: ImplicitParjser<T2>,
    alt2: ImplicitParjser<T3>,
    alt3: ImplicitParjser<T4>,
    alt4: ImplicitParjser<T5>
): ParjsCombinator<T1, T1 | T2 | T3 | T4 | T5>;

export function or(...alts: ImplicitParjser<any>[]) {
    const resolvedAlts = alts.map(x => ScalarConverter.convert(x) as any as ParjserBase);
    return defineCombinator(source => {
        resolvedAlts.splice(0, 0, source);

        const altNames = resolvedAlts.map(x => x.type);
        return new (class Or extends ParjserBase {
            type = "or";
            expecting = `expecting one of: ${altNames.join(", ")}`;
            _apply(ps: ParsingState): void {
                const { position } = ps;
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let i = 0; i < resolvedAlts.length; i++) {
                    // go over each alternative.
                    const cur = resolvedAlts[i];
                    // apply it on the current state.
                    cur.apply(ps);
                    if (ps.isOk) {
                        // if success, return. The PS records the result.
                        return;
                    } else if (ps.isSoft) {
                        // backtrack to the original position and try again.
                        ps.position = position;
                    } else {
                        // if failure, return false,
                        return;
                    }
                }
                ps.kind = ResultKind.SoftFail;
            }
        })();
    });
}
