import type { CombinatorInput } from "../combinated";
import { Combinated } from "../combinated";
import type { ParjsCombinator } from "../parjser";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";
import type { ImplicitParjser } from "../wrap-implicit";
import { wrapImplicit } from "../wrap-implicit";

import type { getParsedType } from "../util-types";

class Or<T, Alts extends CombinatorInput<unknown>[]> extends Combinated<
    T,
    T | getParsedType<Alts[number]>
> {
    type = "or";
    _altNames = [this.source, ...this._alts].map(x => `'${x.expecting}' (${x.type})`);
    expecting = `expecting one of: ${this._altNames.join(", ")}`;

    constructor(
        source: CombinatorInput<T>,
        private readonly _alts: Alts
    ) {
        super(source);
    }

    _apply(ps: ParsingState): void {
        const { position } = ps;
        const resolvedAlts = [this.source, ...this._alts];
        const allExpectations = resolvedAlts.map(x => x.expecting);
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
                allExpectations[i] = ps.reason!;
            } else {
                // propagate hard failure
                return;
            }
        }
        ps.reason = allExpectations.join(" OR ");
        ps.kind = ResultKind.SoftFail;
    }
}

export function or<const T, Opts extends ImplicitParjser<unknown>[]>(
    ...alts: Opts
): ParjsCombinator<T, T | getParsedType<Opts[number]>> {
    const resolvedAlts = alts.map(wrapImplicit) as {
        [K in keyof Opts]: CombinatorInput<getParsedType<Opts[K]>>;
    };
    return (source: ImplicitParjser<T>) => {
        return new Or<T, typeof resolvedAlts>(wrapImplicit(source), resolvedAlts);
    };
}
