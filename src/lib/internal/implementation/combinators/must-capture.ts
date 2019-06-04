/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ReplyKind} from "../../../../reply";
import {ParsingState} from "../../state";
import {AnyParser} from "../../../../any";
import {ParjsCombinator} from "../../../../loud-combinators";
import {rawCombinator} from "../combinator";
import {BaseParjsParser} from "../../parser";

export function mustCapture<T extends AnyParser>(failType = ReplyKind.HardFail): ParjsCombinator<T, T> {
    return rawCombinator(source => {
        return new class MustCapture extends BaseParjsParser {
            isLoud = source.isLoud;
            expecting = `internal parser ${source.displayName} to consume input`;
            displayName = "mustCapture";
            _apply(ps: ParsingState) {
                let {position} = ps;
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                ps.kind = position !== ps.position ? ReplyKind.Ok : failType;
            }
        }();
    });
}
