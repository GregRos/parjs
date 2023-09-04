/**
 * @module parjs/combinators
 */
/** */

import { ParsingState } from "../state";
import { ParjsValidator } from "../parjser";
import { ParjsCombinator } from "../../";
import { defineCombinator } from "./combinator";
import { ParjserBase } from "../parser";

/**
 * Applies the source parser and makes sure its result fulfills `predicate`.
 * @param predicate The condition to check for.
 */
export function must<T>(predicate: ParjsValidator<T>): ParjsCombinator<T, T> {
    return defineCombinator(source => {
        return new (class Must extends ParjserBase {
            type = "must";
            expecting = `internal parser ${source.type} yielding a result satisfying condition`;

            _apply(ps: ParsingState): void {
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                const result = predicate(ps.value, ps.userState);
                if (result === true) return;
                ps.kind = result.kind || "Soft";
                ps.reason = result.reason || "failed to fulfill a predicate";
            }
        })();
    });
}
