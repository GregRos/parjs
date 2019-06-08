/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ReplyKind} from "../../../reply";
import {LoudParser} from "../../../loud";
import {BaseParjsParser} from "../parser";

export function position(): LoudParser<number> {
    return new class Position extends BaseParjsParser {
        expecting = "anything";
        type = "position";
        _apply(ps: ParsingState) {
            ps.value = ps.position;
            ps.kind = ReplyKind.Ok;
        }
    }();
}
