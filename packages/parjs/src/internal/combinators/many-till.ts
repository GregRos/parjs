import type { ParjsCombinator } from "../../index";
import type { CombinatorInput } from "../combinated";
import { Combinated } from "../combinated";
import { Issues } from "../issues";
import type { ImplicitParjser } from "../parser";
import { wrapImplicit } from "../parser";
import { ResultKind } from "../result";
import type { ParsingState, UserState } from "../state";
import { pipe } from "./combinator";
import { qthen } from "./then";

const defaultProjection = <TSource>(sourceMatches: TSource[], till: unknown, state: unknown) =>
    sourceMatches;

class ManyTill<TSource, TTill, TResult> extends Combinated<TSource, TResult> {
    type = "manyTill";
    expecting = `${this.source.expecting} or ${this._till.expecting}`;

    constructor(
        source: CombinatorInput<TSource>,
        private readonly _till: CombinatorInput<TTill>,
        private readonly _project: (source: TSource[], till: TTill, user: UserState) => TResult
    ) {
        super(source);
    }

    _apply(ps: ParsingState): void {
        let { position } = ps;
        const arr: TSource[] = [];
        let successes = 0;
        for (;;) {
            this._till.apply(ps);
            if (ps.isOk) {
                break;
            } else if (ps.atLeast(ResultKind.HardFail)) {
                // if till failed hard/fatally, we return the fail result.
                return;
            }
            // backtrack to before till failed.
            ps.position = position;
            this.source.apply(ps);
            if (ps.isOk) {
                arr.push(ps.value as TSource);
            } else if (ps.isSoft) {
                // many failed softly before till...
                ps.kind = successes === 0 ? ResultKind.SoftFail : ResultKind.HardFail;
                return;
            } else {
                // many failed hard/fatal
                return;
            }
            if (ps.position === position) {
                Issues.guardAgainstInfiniteLoop("manyTill");
            }
            position = ps.position;
            successes++;
        }
        ps.value = this._project(arr, ps.value as TTill, ps.userState);
        ps.kind = ResultKind.Ok;
    }
}

/**
 * Tries to apply the source parser repeatedly until `till` succeeds. Yields the results of the
 * source parser in an array.
 *
 * @param till The parser that indicates iteration should stop.
 * @param pProject A projection to apply on the captured results.
 */
export function manyTill<TSource, TTill, TResult = TSource[]>(
    till: ImplicitParjser<TTill>,
    pProject: (source: TSource[], till: TTill, user: UserState) => TResult
): ParjsCombinator<TSource, TResult>;
export function manyTill<TSource, TTill>(
    till: ImplicitParjser<TTill>
): ParjsCombinator<TSource, TSource[]>;
export function manyTill<TSource, TTill, TResult = TSource[]>(
    till: ImplicitParjser<TTill>,
    pProject?: (source: TSource[], till: TTill, user: UserState) => TResult
): ParjsCombinator<TSource, TResult> {
    const tillResolved = wrapImplicit(till);
    const project = pProject || defaultProjection;
    return (source: ImplicitParjser<TSource>) => {
        return new ManyTill<TSource, TTill, TResult>(
            wrapImplicit(source),
            tillResolved,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            project as any
        );
    };
}

/**
 * Applies `start` and then repeatedly applies the source parser until `pTill` succeeds. Similar to
 * a mix of `between` and `manyTill`. Yields the results of the source parser in an array.
 *
 * @param start The initial parser to apply.
 * @param pTill Optionally, the terminator. Defaults to `start`.
 * @param projection Optionally, a projection to apply on the captured results.
 */
export function manyBetween<TSource, TStart, TTill = TStart, TResult = TSource[]>(
    start: ImplicitParjser<TStart>,
    pTill?: ImplicitParjser<TTill>,
    projection?: (sources: TSource[], till: TTill | TStart, state: UserState) => TResult
): ParjsCombinator<TSource, TResult> {
    const till: ImplicitParjser<TTill | TStart> = pTill || start;
    return source => {
        const wrapped = wrapImplicit(source);
        return pipe(
            start,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            qthen(wrapped.pipe(manyTill(till, projection as any)))
        );
    };
}
