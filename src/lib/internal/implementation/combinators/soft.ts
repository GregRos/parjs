/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ParsingState} from "../state";
import {ReplyKind} from "../../../reply";
import {LoudParser, ParjsCombinator} from "../../../";

import {defineCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";

/**
 * Applies the source parser and yields its result. Reduces failure severity
 * from Hard to Soft.
 */
export function soft<T>(): ParjsCombinator<T, T> {
    return defineCombinator(source => {
        return new class Soft extends BaseParjsParser {
            type = "soft";
            expecting = source.expecting;
            _apply(ps: ParsingState): void {
                source.apply(ps);
                if (ps.isHard) {
                    ps.kind = ReplyKind.SoftFail;
                }
            }

        }();
    });
}
