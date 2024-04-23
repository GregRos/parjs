import { Combinated } from "../combinated";
import { Issues } from "../issues";
import type { ParjsCombinator } from "../parjser";
import type { ParjserBase } from "../parser";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";
import { wrapImplicit } from "../wrap-implicit";

class Many1<T> extends Combinated<T, [T, ...T[]]> {
    type = "many1";
    expecting = this.source.expecting;
    constructor(
        source: ParjserBase<T>,
        private _maxIterations: number
    ) {
        super(source);
    }
    _apply(ps: ParsingState): void {
        let { position } = ps;
        const arr = [] as unknown[];
        let i = 0;
        for (;;) {
            this.source.apply(ps);
            if (!ps.isOk) break;
            if (i >= this._maxIterations) break;
            if (this._maxIterations === Infinity && ps.position === position) {
                Issues.guardAgainstInfiniteLoop(this.type);
            }
            position = ps.position;
            arr.push(ps.value);
            i++;
        }
        if (ps.atLeast(ResultKind.HardFail)) {
            return;
        }

        if (i === 0) {
            ps.kind = ResultKind.SoftFail;
            ps.reason = "expected at least one match";
            return;
        }

        ps.value = arr;
        // recover from the last failure.
        ps.position = position;
        ps.kind = ResultKind.Ok;
    }
}

/**
 * Applies the source parser 1 or more times until it fails softly. Yields all of its results in an
 * array.
 *
 * @param maxIterations Optionally, the maximum number of times to apply the source parser. Defaults
 *   to `Infinity`.
 */
export function many1<T>(maxIterations = Infinity): ParjsCombinator<T, [T, ...T[]]> {
    return source => new Many1<T>(wrapImplicit(source), maxIterations);
}
