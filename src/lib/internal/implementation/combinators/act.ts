/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ParsingState} from "../state";

import {LoudParser, ParjsProjection} from "../../../loud";
import {ParjsCombinator} from "../../../";
import {defineCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";

/**
 * Applies `action` to each result emitted by the source parser and emits its results unchanged.
 * @param action
 */
export function each<T>(action: ParjsProjection<T, void>)
    : ParjsCombinator<T, T>;
export function each(action: any) {
    return defineCombinator(source => {
        return new class extends BaseParjsParser {
            type = "each";
            expecting = source.expecting;

            _apply(ps: ParsingState): void {
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                action(ps.value, ps.userState);
            }

        }();
    });
}
