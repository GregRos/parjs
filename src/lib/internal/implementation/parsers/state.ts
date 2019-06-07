/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ReplyKind} from "../../../reply";
import {ParjsCombinator} from "../../../";

import {LoudParser} from "../../../loud";
import {BaseParjsParser} from "../parser";
import {defineCombinator} from "../combinators/combinator";

export function state(): LoudParser<any> {
    return new class State extends BaseParjsParser {
        displayName = "state";
        expecting = "anything";

        protected _apply(ps: ParsingState): void {
            ps.value = ps.userState;
            ps.kind = ReplyKind.Ok;
        }

    }();
}
