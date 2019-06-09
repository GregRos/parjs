/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ResultKind} from "../../reply";
import {ParjserBase} from "../parser";
import {Parjser} from "../../parjser";


export function stringLen(length: number): Parjser<string> {
    return new class StringLen extends ParjserBase {
        type = "stringLen";
        expecting = `${length} characters`;
        _apply(ps: ParsingState) {
            let {position, input} = ps;
            if (input.length < position + length) {
                ps.kind = ResultKind.SoftFail;
                return;
            }
            ps.position += length;
            ps.value = input.substr(position, length);
            ps.kind = ResultKind.Ok;
        }
    }();
}
