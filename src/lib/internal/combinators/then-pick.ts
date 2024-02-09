import type { ParjsCombinator, ParjsProjection } from "../parjser";
import type { ParsingState } from "../state";
import type { ImplicitParjser } from "../wrap-implicit";
import { wrapImplicit } from "../wrap-implicit";
import type { CombinatorInput } from "../combinated";
import { Combinated } from "../combinated";

class ThenPick<A, B> extends Combinated<A, B> {
    expecting = `${this.source.expecting} then <dynamic>`;
    type = "then-pick";
    constructor(
        source: CombinatorInput<A>,
        private _ctor: ParjsProjection<A, ImplicitParjser<B>>
    ) {
        super(source);
    }
    _apply(ps: ParsingState): void {
        this.source.apply(ps);
        if (!ps.isOk) {
            return;
        }
        const nextParser = wrapImplicit(this._ctor(ps.value as A, ps.userState));
        nextParser.apply(ps);
        if (ps.isOk) {
            return;
        }
        if (ps.isSoft) {
            ps.kind = "Hard";
        }
    }
}

/**
 * Applies the source parser, and then applies a selector on the source parser's
 * result and user state to choose or create the parser to apply next.
 * @param selector
 */
export function thenPick<A, B>(
    selector: ParjsProjection<A, ImplicitParjser<B>>
): ParjsCombinator<A, B> {
    return source => new ThenPick(wrapImplicit(source), selector);
}
