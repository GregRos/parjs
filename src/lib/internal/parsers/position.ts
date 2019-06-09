/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ReplyKind} from "../../reply";
import {Parjser} from "../../loud";
import {ParjserBase} from "../parser";

export function position(): Parjser<number> {
    return new class Position extends ParjserBase {
        expecting = "anything";
        type = "position";
        _apply(ps: ParsingState) {
            ps.value = ps.position;
            ps.kind = ReplyKind.Ok;
        }
    }();
}
