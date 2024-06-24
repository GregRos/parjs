import type { CombinatorInput } from "../combinated";
import { Combinated } from "../combinated";
import type { ParjsCombinator } from "../parjser";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";
import { wrapImplicit } from "../wrap-implicit";

class MaybeCombinator<T, S> extends Combinated<T, S | T> {
    type = "maybe";

    expecting = "expecting anything";

    constructor(
        source: CombinatorInput<T>,
        private readonly _val: S | undefined
    ) {
        super(source);
    }

    _apply(ps: ParsingState): void {
        this.source.apply(ps);
        if (ps.isSoft) {
            // on soft failure, set the value and result to OK
            ps.value = this._val;
            ps.kind = ResultKind.Ok;
        }
        // on ok/hard/fatal, propagate the result.
    }
}

/**
 * Applies the source parser. If it fails softly, succeeds and yields `val`.
 *
 * @param val
 */
export function maybe<const T, const S = T | undefined>(val?: S): ParjsCombinator<T, T | S> {
    return source => new MaybeCombinator<T, S>(wrapImplicit(source), val);
}
