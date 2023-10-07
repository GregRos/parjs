/**
 * @module parjs
 */
/** */

import { ParsingState } from "../state";
import { ResultKind } from "../result";
import { Parjser } from "../parjser";
import { ParjserBase } from "../parser";

/**
 * Returns a parser that will try to match the regular expression at the current
 * position and yield the result set. If it can't, the parser will fail softly.
 * The match must start at the current position. It can't skip any part of the
 * input.
 * @param origRegexp
 */
export function regexp(origRegexp: RegExp): Parjser<string[]> {
    const flags = [origRegexp.ignoreCase && "i", origRegexp.multiline && "m"]
        .filter(x => x)
        .join("");
    const re = new RegExp(origRegexp.source, `${flags}y`);
    return new (class Regexp extends ParjserBase<string[]> {
        type = "regexp";
        expecting = `expecting input matching '${re.source}'`;
        _apply(ps: ParsingState) {
            const { input, position } = ps;
            re.lastIndex = position;
            const match = re.exec(input);
            if (!match) {
                ps.kind = ResultKind.SoftFail;
                return;
            }
            ps.position += match[0].length;
            ps.value = match.slice();
            ps.kind = ResultKind.Ok;
        }
    })();
}
