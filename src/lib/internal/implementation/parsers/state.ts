/**
 * @module parjs/internal/implementation/parsers
 */
/** */
import {ParjsAction} from "../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {ParjsCombinator} from "../../../../loud-combinators";
import {AnyParser} from "../../../../any";
import {LoudParser} from "../../../../loud";
import {BaseParjsParser} from "../../parser";
import {rawCombinator} from "../../combinators/combinator";

export function state(): LoudParser<any> {
    return new class State extends BaseParjsParser {
        displayName = "state";
        expecting = "anything";
        isLoud: true = true;

        protected _apply(ps: ParsingState): void {
            ps.value = ps.userState;
            ps.kind = ReplyKind.Ok;
        }

    }();
}
