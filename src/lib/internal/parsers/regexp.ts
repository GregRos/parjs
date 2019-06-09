/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ResultKind} from "../../reply";
import {Parjser} from "../../parjser";
import {ParjserBase} from "../parser";

export function regexp(origRegexp: RegExp): Parjser<string[]> {
    let flags = [origRegexp.ignoreCase && "i", origRegexp.multiline && "m"].filter(x => x).join("");
    let regexp = new RegExp(origRegexp.source, `${flags}y`);
    this.reason = `input matching '${origRegexp.source}'`;
    return new class Regexp extends ParjserBase {
        type = "regexp";
        expecting = `input matching '${regexp.source}'`;
        _apply(ps: ParsingState) {
            let {input, position} = ps;
            regexp.lastIndex = position;
            let match = regexp.exec(input);
            if (!match) {
                ps.kind = ResultKind.SoftFail;
                return;
            }
            ps.position += match[0].length;
            ps.value = match.slice();
            ps.kind = ResultKind.Ok;
        }
    }();
}
