import type { ParjsCombinator } from "../../";
import type { CombinatorInput } from "../combinated";
import { Combinated } from "../combinated";
import type { ParjsValidator } from "../parjser";
import type { ParsingState } from "../state";
import { wrapImplicit } from "../wrap-implicit";

class Must<T> extends Combinated<T, T> {
    type = "must";
    expecting = `internal parser ${this.source.type} yielding a result satisfying condition`;
    constructor(
        source: CombinatorInput<T>,
        private readonly _predicate: ParjsValidator<T>
    ) {
        super(source);
    }
    _apply(ps: ParsingState): void {
        this.source.apply(ps);
        if (!ps.isOk) {
            return;
        }
        const result = this._predicate(ps.value as T, ps.userState);
        if (result === true) return;
        ps.kind = result.kind || "Soft";
        ps.reason = result.reason || "failed to fulfill a predicate";
    }
}

/**
 * Applies the source parser and makes sure its result fulfills `predicate`.
 *
 * @param predicate The condition to check for.
 */
export function must<T>(predicate: ParjsValidator<T>): ParjsCombinator<T, T> {
    return source => new Must<T>(wrapImplicit(source), predicate);
}
