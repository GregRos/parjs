/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {ArrayHelpers} from "../../functions/helpers";
import {ParjsCombinator} from "../../../../loud-combinators";
import {LoudParser} from "../../../../loud";
import {QuietParser} from "../../../../quiet";
import {rawCombinator} from "../combinator";
import {BaseParjsParser} from "../../parser";

export function exactly<T>(count: number)
    : ParjsCombinator<LoudParser<T>, LoudParser<T[]>>;
export function exactly(count: number)
    : ParjsCombinator<QuietParser, QuietParser>;
export function exactly(count: number) {
    return rawCombinator(source => {
        return new class Exactly extends BaseParjsParser {
            displayName = "exactly";
            expecting = source.expecting;
            isLoud = source.isLoud;
            protected _apply(ps: ParsingState): void {
                let arr = [];
                for (let i = 0; i < count; i++) {
                    source.apply(ps);
                    if (!ps.isOk) {
                        if (ps.kind === ReplyKind.SoftFail && i > 0) {
                            ps.kind = ReplyKind.HardFail;
                        }
                        //fail because the inner parser has failed.
                        return;
                    }
                    ArrayHelpers.maybePush(arr, ps.value);
                }
                ps.value = arr;
            }
        }();
    });
}
