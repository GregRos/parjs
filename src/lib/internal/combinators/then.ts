import type { ImplicitParjser, ParjsCombinator } from "../../index";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";

import type { CombinatorInput } from "../combinated";
import { Combinated } from "../combinated";
import { wrapImplicit } from "../wrap-implicit";
import { composeCombinator } from "./combinator";
import { map } from "./map";

import type { getParsedType } from "../util-types";

/**
 * Applies the source parser followed by `next`. Yields the result of `next`.
 *
 * @param next
 */
export function qthen<T>(next: ImplicitParjser<T>): ParjsCombinator<unknown, T> {
    return composeCombinator(
        then(next),
        map(arr => arr[1])
    );
}

/**
 * Applies the source parser followed by `next`. Yields the result of the source parser.
 *
 * @param next
 */
export function thenq<T>(next: ImplicitParjser<unknown>): ParjsCombinator<T, T> {
    return composeCombinator(
        then(next),
        map(arr => arr[0])
    );
}

class Then<T, Rest extends CombinatorInput<unknown>[]> extends Combinated<
    T,
    [
        T,
        ...{
            [K in keyof Rest]: getParsedType<Rest[K]>;
        }
    ]
> {
    type = "then";
    expecting = this.source.expecting;
    private _seq = [this.source, ...this._rest];

    constructor(
        source: CombinatorInput<T>,
        private _rest: Rest
    ) {
        super(source);
    }

    _apply(ps: ParsingState): void {
        const results = [] as unknown[];
        const { _seq } = this;
        const origPos = ps.position;
        for (const cur of _seq) {
            cur.apply(ps);
            if (ps.isOk) {
                results.push(ps.value);
            } else if (ps.isSoft && origPos === ps.position) {
                // if the first parser failed softly then we propagate a soft failure.
                return;
            } else if (ps.isSoft) {
                ps.kind = ResultKind.HardFail;
                // if a i > 0 parser failed softly, this is a hard fail for us.
                // also, propagate the internal expectation.
                return;
            } else {
                // ps failed hard or fatally. The same severity.
                return;
            }
        }
        ps.value = results;
        ps.kind = ResultKind.Ok;
    }
}

export function then<T, Parsers extends ImplicitParjser<unknown>[]>(
    ...parsers: Parsers
): ParjsCombinator<T, [T, ...{ [K in keyof Parsers]: getParsedType<Parsers[K]> }]> {
    const resolvedParsers = parsers.map(wrapImplicit) as {
        [K in keyof Parsers]: CombinatorInput<getParsedType<Parsers[K]>>;
    };
    return source => {
        return new Then<T, typeof resolvedParsers>(wrapImplicit(source), resolvedParsers);
    };
}
