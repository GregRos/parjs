/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ReplyKind} from "../../../../reply";
import {ParsingState} from "../../state";
import {ParjsCombinator} from "../../../../loud-combinators";
import {AnyParser} from "../../../../any";
import {QuietParser} from "../../../../quiet";
import {rawCombinator} from "../combinator";
import {BaseParjsParser} from "../../parser";

export function not(): ParjsCombinator<AnyParser, QuietParser> {
    return rawCombinator(source => {
        return new class Not extends BaseParjsParser {
            displayName = "not";
            expecting = `not: ${source.expecting}`; // TODO: better expecting
            isLoud = false;
            _apply(ps: ParsingState): void {
                let {position} = ps;
                source.apply(ps);
                if (ps.isOk) {
                    ps.position = position;
                    ps.kind = ReplyKind.SoftFail;
                } else if (ps.kind === ReplyKind.HardFail || ps.kind === ReplyKind.SoftFail) {
                    //hard fails are okay here
                    ps.kind = ReplyKind.Ok;
                    ps.position = position;
                    return;
                }
                //the remaining case is a fatal failure that isn't recovered from.
            }

        }();
    });
}
