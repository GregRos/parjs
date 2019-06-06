/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ParsingState} from "../state";
import {ReplyKind} from "../../../reply";
import {LoudParser, ParjsCombinator} from "../../../";

import {rawCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";

export function soft<T>(): ParjsCombinator<LoudParser<T>, LoudParser<T>> {
    return rawCombinator(source => {
        return new class Soft extends BaseParjsParser {
            displayName = "soft";
            expecting = source.expecting;
            protected _apply(ps: ParsingState): void {
                source.apply(ps);
                if (ps.isHard) {
                    ps.kind = ReplyKind.SoftFail;
                }
            }

        }();
    });
}
