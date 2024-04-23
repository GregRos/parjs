import { Combinated } from "../combinated";
import type { ParjsCombinator, ParjsProjection } from "../parjser";
import type { ParjserBase } from "../parser";
import type { ParsingState } from "../state";
import { wrapImplicit } from "../wrap-implicit";

class Map<T, S> extends Combinated<T, S> {
    type = "map";
    expecting = this.source.expecting;
    constructor(
        source: ParjserBase<T>,
        private readonly _projection: ParjsProjection<T, S>
    ) {
        super(source);
    }
    _apply(ps: ParsingState): void {
        this.source.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.value = this._projection(ps.value as T, ps.userState);
    }
}

/**
 * Applies the source parser and projects its result with `projection`.
 *
 * @param projection The projection to apply.
 */
export function map<A, B>(projection: ParjsProjection<A, B>): ParjsCombinator<A, B> {
    return source => new Map(wrapImplicit(source), projection);
}

/**
 * Applies the source parser and yields the constant value `result`.
 *
 * @param result The constant value to yield.
 */
export function mapConst<T>(result: T): ParjsCombinator<unknown, T> {
    return map(() => result);
}
