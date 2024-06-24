import type { ImplicitParjser, ParjsCombinator } from "../../index";
import type { CombinatorInput } from "../combinated";
import { Combinated } from "../combinated";
import { Issues } from "../issues";
import type { ParjserBase } from "../parser";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";
import { wrapImplicit } from "../wrap-implicit";

export type ArrayWithSeparators<Normal, Separator> = Normal[] & {
    separators: Separator[];
};

export function getArrayWithSeparators<T, S>(
    things: T[],
    separators: S[]
): ArrayWithSeparators<T, S> {
    const array = things as ArrayWithSeparators<T, S>;
    array.separators = separators;
    return array;
}

export interface ManySepByOptions<Sep> {
    delimeter: CombinatorInput<Sep>;
    max?: number;
}

class ManySepBy<E, Sep> extends Combinated<E, ArrayWithSeparators<E, Sep>> {
    type = "manySepBy";
    expecting = this.source.expecting;
    constructor(
        source: CombinatorInput<E>,
        private readonly _options: ManySepByOptions<Sep>
    ) {
        super(source);
    }
    _apply(ps: ParsingState): void {
        const results: ArrayWithSeparators<E, Sep> = getArrayWithSeparators<E, Sep>([], []);
        const {
            source,
            _options: { delimeter, max = Infinity }
        } = this;
        source.apply(ps);
        if (ps.atLeast(ResultKind.HardFail)) {
            return;
        } else if (ps.isSoft) {
            ps.value = results;
            ps.kind = ResultKind.Ok;
            return;
        }
        let { position } = ps;
        results.push(ps.value as E);
        let i = 1;
        for (;;) {
            if (i >= max) break;
            delimeter.apply(ps);
            if (ps.isSoft) {
                break;
            } else if (ps.atLeast(ResultKind.HardFail)) {
                return;
            }
            results.separators.push(ps.value as Sep);
            source.apply(ps);
            if (ps.isSoft) {
                break;
            } else if (ps.atLeast(ResultKind.HardFail)) {
                return;
            }
            if (max >= Infinity && ps.position === position) {
                Issues.guardAgainstInfiniteLoop("manySepBy");
            }
            results.push(ps.value as E);
            position = ps.position;
            i++;
        }
        ps.kind = ResultKind.Ok;
        ps.position = position;
        ps.value = results;
    }
}

/**
 * Applies the source parser repeatedly until it fails softly, with each pair of applications
 * separated by applying `delimeter`. Also terminates if `delimeter` fails softly. Yields all the
 * results of the source parser in an array.
 *
 * @template E The type of the source parser.
 * @template Sep The type of the delimeter (separator) parser.
 * @param delimeter Parser that separates two applications of the source.
 * @param max Optionally, then maximum number of times to apply the source parser. Defaults to
 *   `Infinity`.
 */
export function manySepBy<E, Sep>(
    delimeter: ImplicitParjser<Sep>,
    max?: number
): ParjsCombinator<E, ArrayWithSeparators<E, Sep>>;

export function manySepBy<E, Sep>(implDelimeter: ImplicitParjser<Sep>, max = Infinity) {
    const delimeter = wrapImplicit(implDelimeter) as ParjserBase<Sep>;
    return (source: ImplicitParjser<E>) => {
        return new ManySepBy(wrapImplicit(source), { delimeter, max });
    };
}
