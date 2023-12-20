/**
 * @module parjs/combinators
 */
/** */

import type { ParsingState } from "../state";

import type { ParjsProjection } from "../parjser";
import type { ParjsCombinator } from "../../index";
import { defineCombinator } from "./combinator";
import { ParjserBase } from "../parser";

/**
 * Applies `action` to each result emitted by the source parser and emits its results unchanged.
 * @param action
 */
export function each<T>(action: ParjsProjection<T, void>): ParjsCombinator<T, T> {
    return defineCombinator<T, T>(source => {
        return new (class extends ParjserBase<T> {
            type = "each";
            expecting = source.expecting;

            _apply(ps: ParsingState): void {
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                action(ps.value as T, ps.userState);
            }
        })();
    });
}
