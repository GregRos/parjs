/**
 * @module parjs/internal/implementation/parsers
 */
/** */
import {ParjsBasicAction} from "../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {LoudParser} from "../../../../loud";
import {BaseParjsParser} from "../../parser";

export function regexp(origRegexp: RegExp): LoudParser<string> {
    let flags = [origRegexp.ignoreCase && "i", origRegexp.multiline && "m"].filter(x => x).join("");
    let regexp = new RegExp(origRegexp.source, `${flags}y`);
    this.expecting = `input matching '${origRegexp.source}'`;
    return new class Regexp extends BaseParjsParser {
        isLoud: true = true;
        expecting = `input matching '${regexp.source}'`;
        _apply(ps: ParsingState) {
            let {input, position} = ps;
            regexp.lastIndex = position;
            let match = regexp.exec(input);
            if (!match) {
                ps.kind = ReplyKind.SoftFail;
                return;
            }
            ps.position += match[0].length;
            ps.value = match.slice();
            ps.kind = ReplyKind.Ok;
        }
    }();
}
