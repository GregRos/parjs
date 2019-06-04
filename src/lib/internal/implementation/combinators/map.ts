/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {ParsingState} from "../../state";
import {ParjsCombinator} from "../../../../loud-combinators";
import {LoudParser, ParjsProjection} from "../../../../loud";
import {ParjsProjectionQuiet, QuietParser} from "../../../../quiet";
import {rawCombinator} from "../combinator";
import {BaseParjsParser} from "../../parser";
import {QUIET_RESULT} from "../../special-results";

export function map<TIn, TOut>(projection: ParjsProjection<TIn, TOut>)
    : ParjsCombinator<LoudParser<TIn>, LoudParser<TOut>>;
export function map<T>(projection: ParjsProjectionQuiet<T>)
    : ParjsCombinator<QuietParser, LoudParser<T>>;
export function map(projection: any) {
    return rawCombinator(source => {
        return new class Map extends BaseParjsParser {
            displayName = "map";
            expecting = source.expecting;
            isLoud = source.isLoud;

            protected _apply(ps: ParsingState): void {
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                ps.value = ps.value === QUIET_RESULT ? projection(ps.userState) : projection(ps.value, ps.userState);
            }

        }();
    });
}
