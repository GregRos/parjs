/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ParsingState} from "../state";
import {ParjsCombinator} from "../../../";
import {LoudParser} from "../../../loud";
import {BaseParjsParser} from "../parser";
import {defineCombinator} from "./combinator";


/**
 * Applies the source parser. If it succeeds, backtracks to the current position in the input
 * and yields the result.
 */
export function backtrack<T>(): ParjsCombinator<T, T> {
    return defineCombinator(source => {
        return new class Backtrack extends BaseParjsParser {
            type = "backtrack";
            expecting = source.expecting;

            _apply(ps: ParsingState): void {
                let {position} = ps;
                source.apply(ps);
                if (ps.isOk) {
                    //if inner succeeded, we backtrack.
                    ps.position = position;
                }
                //whatever code ps had, we return it.
            }

        }();
    });
}
