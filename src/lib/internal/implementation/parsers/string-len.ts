/**
 * @module parjs/internal/implementation/parsers
 */
/** */
import {ParjsBasicAction} from "../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {BaseParjsParser} from "../../parser";
import {LoudParser} from "../../../../loud";


export function stringLen(length: number): LoudParser<string> {
    return new class StringLen extends BaseParjsParser {
        isLoud: true = true;
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
