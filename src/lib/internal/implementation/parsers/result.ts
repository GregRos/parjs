/**
 * @module parjs/internal/implementation/parsers
 */
/** */
import {ParjsBasicAction} from "../../action";
import {ReplyKind} from "../../../../reply";
import {ParsingState} from "../../state";
import {LoudParser} from "../../../../loud";
import {BaseParjsParser} from "../../parser";

export function result<T>(x: T): LoudParser<T> {
    return new class Result extends BaseParjsParser {
        expecting = "anything";
        isLoud: true = true;

        _apply(ps: ParsingState): void {
            ps.value = x;
            ps.kind = ReplyKind.Ok;
        }

    }();
}
