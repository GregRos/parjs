/**
 * @module parjs
 */
/** */

import type { ParsingState } from "../state";
import { ResultKind } from "../result";
import { ParjserBase } from "../parser";
import type { Parjser } from "../..";

/**
 * Returns a parser that parses exactly `length` characters and yields the
 * text that was parsed.
 * @param length The number of characters to parse.
 */
export function stringLen(length: number): Parjser<string> {
    return new (class StringLen extends ParjserBase<string> {
        type = "stringLen";
        expecting = `expecting ${length} characters`;
        _apply(ps: ParsingState) {
            const { position, input } = ps;
            if (input.length < position + length) {
                ps.kind = ResultKind.SoftFail;
                return;
            }
            ps.position += length;
            ps.value = input.substr(position, length);
            ps.kind = ResultKind.Ok;
        }
    })();
}
