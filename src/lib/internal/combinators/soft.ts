/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ParsingState} from "../state";
import {ResultKind} from "../reply";
import {ParjsCombinator} from "../../";

import {defineCombinator} from "./combinator";
import {ParjserBase} from "../parser";

/**
 * Reduces Hard failures to Soft ones and behaves in the same way on success.
 */
export function soft<T>(): ParjsCombinator<T, T> {
    return defineCombinator(source => {
        return new class Soft extends ParjserBase {
            type = "soft";
            expecting = source.expecting;
            _apply(ps: ParsingState): void {
                source.apply(ps);
                if (ps.isHard) {
                    ps.kind = ResultKind.SoftFail;
                }
            }

        }();
    });
}
