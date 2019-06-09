/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ReplyKind} from "../../reply";
import {BaseParjsParser} from "../parser";
import {Parjser} from "../../loud";


export function stringLen(length: number): Parjser<string> {
    return new class StringLen extends BaseParjsParser {
        type = "stringLen";
        expecting = `${length} characters`;
        _apply(ps: ParsingState) {
            let {position, input} = ps;
            if (input.length < position + length) {
                ps.kind = ReplyKind.SoftFail;
                return;
            }
            ps.position += length;
            ps.value = input.substr(position, length);
            ps.kind = ReplyKind.Ok;
        }
    }();
}
