/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ParsingState} from "../state";

import {LoudParser, ParjsProjection} from "../../../loud";
import {ParjsCombinator} from "../../../";
import {rawCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";

/**
 * Returns a parser that applies `P`, and calls `action` every time `P` it succeeds.
 * @param action
 */
export function each<T>(action: ParjsProjection<T, void>)
    : ParjsCombinator<LoudParser<T>, LoudParser<T>>;
export function each(action: any) {
    return rawCombinator(source => {
        return new class extends BaseParjsParser {
            displayName = "each";
            expecting = source.expecting;

            protected _apply(ps: ParsingState): void {
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                action(ps.value, ps.userState);
            }

        }();
    });
}
