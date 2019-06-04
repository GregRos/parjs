/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {ParsingState} from "../../state";
import {AnyParser} from "../../../../any";
import {LoudParser, ParjsProjection} from "../../../../loud";
import {ParjsCombinator} from "../../../../loud-combinators";
import {ParjsProjectionQuiet, QuietParser} from "../../../../quiet";
import {rawCombinator} from "../combinator";
import {BaseParjsParser} from "../../parser";

export function each<T>(action: ParjsProjection<T, void>)
    : ParjsCombinator<LoudParser<T>, LoudParser<T>>;
export function each(action: ParjsProjectionQuiet<void>)
    : ParjsCombinator<QuietParser, QuietParser>;
export function each(action: any) {
    return rawCombinator(source => {
        return new class extends BaseParjsParser {
            displayName = "each";
            expecting = source.expecting;
            isLoud = false;

            protected _apply(ps: ParsingState): void {
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                source.isLoud ? action(ps.value, ps.userState) : action(ps.userState);
            }

        }();
    });
}
