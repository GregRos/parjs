/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ReplyKind} from "../../../reply";
import {ParsingState} from "../state";
import {LoudParser, ParjsCombinator} from "../../../";

import {defineCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";

/**
 * Applies the source parser. Succeeds if if it fails softly, and fails otherwise.
 */
export function not(): ParjsCombinator<any, void> {
    return defineCombinator(source => {
        return new class Not extends BaseParjsParser {
            displayName = "not";
            expecting = `not: ${source.expecting}`; // TODO: better expecting
            _apply(ps: ParsingState): void {
                let {position} = ps;
                source.apply(ps);
                if (ps.isOk) {
                    ps.position = position;
                    ps.kind = ReplyKind.SoftFail;
                } else if (ps.kind === ReplyKind.HardFail || ps.kind === ReplyKind.SoftFail) {
                    //hard fails are okay here
                    ps.kind = ReplyKind.Ok;
                    ps.position = position;
                    return;
                }
                //the remaining case is a fatal failure that isn't recovered from.
            }

        }();
    });
}
