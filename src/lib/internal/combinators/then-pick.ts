/**
 * @module parjs/combinators
 */
/** */

import { ParjsCombinator, ParjsProjection } from "../parjser";
import { ParjserBase } from "../parser";
import { defineCombinator } from "./combinator";
import { ParsingState } from "../state";
import { ImplicitParjser } from "../scalar-converter";

/**
 * Applies the source parser, and then applies a selector on the source parser's
 * result and user state to choose or create the parser to apply next.
 * @param selector
 */
export function thenPick<A, B>(
    selector: ParjsProjection<A, ImplicitParjser<B>>
): ParjsCombinator<A, B> {
    return defineCombinator<A, B>(source => {
        return new (class ThenPick extends ParjserBase<B> {
            expecting = source.expecting;
            type = "then-pick";

            _apply(ps: ParsingState): void {
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                const nextParser = selector(ps.value as A, ps.userState) as ParjserBase<B>;
                nextParser.apply(ps);
                if (ps.isOk) {
                    return;
                }
                if (ps.isSoft) {
                    ps.kind = "Hard";
                }
            }
        })();
    });
}
