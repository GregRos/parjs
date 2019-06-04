/**
 * @module parjs/internal/implementation/parsers
 */
/** */
import {ParjsBasicAction} from "../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {BaseParjsParser} from "../../parser";
import {QuietParser} from "../../../../quiet";

export function eof(): QuietParser {
    return new class Eof extends BaseParjsParser {
        expecting = "end of input";
        isLoud = false;

        _apply(ps: ParsingState): void {
            if (ps.position === ps.input.length) {
                ps.kind = ReplyKind.Ok;
            } else {
                ps.kind = ReplyKind.SoftFail;
            }
        }

    }() as any;
}
