import type { ImplicitParjser } from "../../index";
import type { CombinatorInput } from "../combinated";
import { Combinated } from "../combinated";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";
import { wrapImplicit } from "../wrap-implicit";

class Exactly<T> extends Combinated<T, T[]> {
    type = "exactly";
    expecting = this.source.expecting;

    constructor(
        source: CombinatorInput<T>,
        private count: number
    ) {
        super(source);
    }

    _apply(ps: ParsingState): void {
        const arr = [] as unknown[];
        for (let i = 0; i < this.count; i++) {
            this.source.apply(ps);
            if (!ps.isOk) {
                if (ps.kind === ResultKind.SoftFail && i > 0) {
                    ps.kind = ResultKind.HardFail;
                }
                // fail because the inner parser has failed.
                return;
            }
            arr.push(ps.value);
        }
        ps.value = arr;
    }
}

/**
 * Applies the source parser exactly `count` times, and yields all the results in an array.
 *
 * @param count The number of times to apply the source parser.
 */
export function exactly(count: number) {
    return <T>(source: ImplicitParjser<T>) => {
        return new Exactly(wrapImplicit(source), count);
    };
}
