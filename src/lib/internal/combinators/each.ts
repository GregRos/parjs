import type { ParsingState } from "../state";

import type { ParjsCombinator, ParjsProjection } from "../parjser";

import type { CombinatorInput } from "../combinated";
import { Combinated } from "../combinated";
import { wrapImplicit } from "../wrap-implicit";

class Each<T> extends Combinated<T, T> {
    type = "each";
    expecting = this.source.expecting;

    constructor(
        source: CombinatorInput<T>,
        private readonly _action: ParjsProjection<T, void>
    ) {
        super(source);
    }

    _apply(ps: ParsingState): void {
        this.source.apply(ps);
        if (!ps.isOk) {
            return;
        }
        this._action(ps.value as T, ps.userState);
    }
}

/**
 * Applies `action` to each result emitted by the source parser and emits its results unchanged.
 *
 * @param action
 */
export function each<T>(action: ParjsProjection<T, void>): ParjsCombinator<T, T> {
    return source => new Each(wrapImplicit(source), action);
}
