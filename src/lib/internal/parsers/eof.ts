/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ReplyKind} from "../../reply";
import {BaseParjsParser} from "../parser";
import {LoudParser} from "../../loud";

export function eof<T>(result?: T): LoudParser<T> {
    return new class Eof extends BaseParjsParser {
        type = "eof";
        expecting = "end of input";

        _apply(ps: ParsingState): void {
            if (ps.position === ps.input.length) {
                ps.kind = ReplyKind.Ok;
                ps.value = result;
            } else {
                ps.kind = ReplyKind.SoftFail;
            }
        }

    }() as any;
}
