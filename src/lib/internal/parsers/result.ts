/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ReplyKind} from "../../reply";
import {ParsingState} from "../state";
import {LoudParser} from "../../loud";
import {BaseParjsParser} from "../parser";

export function result<T>(x: T): LoudParser<T> {
    return new class Result extends BaseParjsParser {
        expecting = "anything";
        type = "result";
        _apply(ps: ParsingState): void {
            ps.value = x;
            ps.kind = ReplyKind.Ok;
        }

    }();
}
