/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {ParjsCombinator} from "../../../../loud-combinators";
import {AnyParser} from "../../../../any";
import {rawCombinator} from "../combinator";
import {BaseParjsParser} from "../../parser";

export function soft<T extends AnyParser>(): ParjsCombinator<T, T> {
    return rawCombinator(source => {
        return new class Soft extends BaseParjsParser {
            displayName = "soft";
            expecting = source.expecting;
            isLoud = source.isLoud;
            protected _apply(ps: ParsingState): void {
                source.apply(ps);
                if (ps.isHard) {
                    ps.kind = ReplyKind.SoftFail;
                }
            }

        }();
    });
}
