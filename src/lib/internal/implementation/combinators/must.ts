/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {AnyParserAction} from "../../../action";
import {LoudParser, ParjsPredicate} from "../../../../loud";
import {ParjsCombinator} from "../../../../loud-combinators";
import {ParjsPredicateQuiet, QuietParser} from "../../../../quiet";
import {rawCombinator} from "../combinator";
import {BaseParjsParser} from "../../parser";

export function must<T>(req: ParjsPredicate<T>, fail ?: ReplyKind.Fail)
    : ParjsCombinator<LoudParser<T>, LoudParser<T>>;
export function must(req: ParjsPredicateQuiet, fail ?: ReplyKind.Fail)
    : ParjsCombinator<QuietParser, QuietParser>;
export function must(req: any, fail = ReplyKind.HardFail) {
    return rawCombinator(source => {
        return new class Must extends BaseParjsParser {
            displayName = "must";
            expecting = `internal parser ${source.displayName} yielding a result satisfying condition`; // TODO better
            isLoud: boolean;

            protected _apply(ps: ParsingState): void {
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                ps.kind = req(ps.value, ps.userState) ? ReplyKind.Ok : fail;
            }

        }();
    });
}
