import type { ImplicitParjser, ParjsCombinator } from "../../index";
import { Issues } from "../issues";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";

import type { CombinatorInput } from "../combinated";
import { Combinated } from "../combinated";
import { wrapImplicit } from "../wrap-implicit";

class Many<T> extends Combinated<T, T[]> {
    type = "many";
    expecting = this.source.expecting;

    constructor(
        source: CombinatorInput<T>,
        private readonly _maxIterations: number
    ) {
        super(source);
    }

    _apply(ps: ParsingState): void {
        let { position } = ps;
        const { source, _maxIterations } = this;
        const arr = [] as unknown[];
        let i = 0;
        for (;;) {
            source.apply(ps);
            if (!ps.isOk) break;
            if (i >= _maxIterations) break;
            if (_maxIterations === Infinity && ps.position === position) {
                Issues.guardAgainstInfiniteLoop("many");
            }
            position = ps.position;
            arr.push(ps.value);
            i++;
        }
        if (ps.atLeast(ResultKind.HardFail)) {
            return;
        }
        ps.value = arr;
        // recover from the last failure.
        ps.position = position;
        ps.kind = ResultKind.Ok;
    }
}

/**
 * Applies the source parser until it fails softly, and yields all of its results in an array.
 *
 * @param maxIterations Optionally, the maximum number of times to apply the source parser. Defaults
 *   to `Infinity`.
 */
export function many<T>(maxIterations = Infinity): ParjsCombinator<T, T[]> {
    return (source: ImplicitParjser<T>) => {
        return new Many<T>(wrapImplicit(source), maxIterations);
    };
}
