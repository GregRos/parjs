/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ResultKind} from "../result";
import {ParjserBase} from "../parser";
import {Parjser} from "../../parjser";

/**
 * Returns a parser that parses exactly `length` characters and yields the
 * text that was parsed.
 * @param length The number of characters to parse.
 */
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
