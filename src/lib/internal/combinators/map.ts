/**
 * @module parjs/combinators
 */
/** */

import { ParsingState } from "../state";
import { ParjsCombinator } from "../../index";
import { ParjsProjection } from "../parjser";
import { defineCombinator } from "./combinator";
import { ParjserBase } from "../parser";

/**
 * Applies the source parser and projects its result with `projection`.
 * @param projection The projection to apply.
 */
export function map<A, B>(projection: ParjsProjection<A, B>): ParjsCombinator<A, B> {
    return defineCombinator<A, B>(source => {
        return new (class Map extends ParjserBase<B> {
            type = "map";
            expecting = source.expecting;

            _apply(ps: ParsingState): void {
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                ps.value = projection(ps.value as A, ps.userState);
            }
        })();
    });
}

/**
 * Applies the source parser and yields the constant value `result`.
 * @param result The constant value to yield.
 */
export function mapConst<T>(result: T): ParjsCombinator<unknown, T> {
    return map(() => result);
}
