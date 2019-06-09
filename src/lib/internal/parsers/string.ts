/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ResultKind} from "../../reply";
import {ParjserBase} from "../parser";
import {Parjser} from "../../parjser";

export function string(str: string): Parjser<string> {
    return new class ParseString extends ParjserBase {
        expecting = `'${str}'`;
        type = "string";
        _apply(ps: ParsingState): void {
            let {position, input} = ps;
            let i;
            if (position + str.length > input.length) {
                ps.kind = ResultKind.SoftFail;
                return;
            }
            for (let i = 0; i < str.length; i++, position++) {
                if (str.charCodeAt(i) !== input.charCodeAt(position)) {
                    ps.kind = ResultKind.SoftFail;
                    return;
                }
            }
            ps.position += str.length;
            ps.value = str;
            ps.kind = ResultKind.Ok;
        }

    }();
}
