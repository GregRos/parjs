/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ReplyKind} from "../../../reply";
import {BaseParjsParser} from "../parser";
import {LoudParser} from "../../../loud";

export function string(str: string): LoudParser<string> {
    return new class ParseString extends BaseParjsParser {
        expecting = `'${str}'`;

        _apply(ps: ParsingState): void {
            let {position, input} = ps;
            let i;
            if (position + str.length > input.length) {
                ps.kind = ReplyKind.SoftFail;
                return;
            }
            for (let i = 0; i < str.length; i++, position++) {
                if (str.charCodeAt(i) !== input.charCodeAt(position)) {
                    ps.kind = ReplyKind.SoftFail;
                    return;
                }
            }
            ps.position += str.length;
            ps.value = str;
            ps.kind = ReplyKind.Ok;
        }

    }();
}
