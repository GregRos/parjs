/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ReplyKind} from "../../../reply";
import {ParsingState} from "../state";

import {LoudParser, ParjsCombinator} from "../../../";
import {rawCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";

export function mustCapture<T>(failType: ReplyKind = ReplyKind.HardFail): ParjsCombinator<LoudParser<T>, LoudParser<T>> {
    return rawCombinator(source => {
        return new class MustCapture extends BaseParjsParser {
            expecting = `internal parser ${source.displayName} to consume input`;
            displayName = "mustCapture";
            _apply(ps: ParsingState) {
                let {position} = ps;
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                ps.kind = position !== ps.position ? ReplyKind.Ok : failType;
            }
        }();
    });
}
