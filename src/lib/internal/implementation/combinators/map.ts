/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ParsingState} from "../state";
import {ParjsCombinator} from "../../../";
import {LoudParser, ParjsProjection} from "../../../loud";
import {rawCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";

export function map<TIn, TOut>(projection: ParjsProjection<TIn, TOut>)
    : ParjsCombinator<LoudParser<TIn>, LoudParser<TOut>>;

export function map(projection: any) {
    return rawCombinator(source => {
        return new class Map extends BaseParjsParser {
            displayName = "map";
            expecting = source.expecting;

            protected _apply(ps: ParsingState): void {
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                ps.value = projection(ps.value, ps.userState);
            }

        }();
    });
}

export function mapConst<T>(result: T)
    : ParjsCombinator<LoudParser<any>, LoudParser<T>> {
    return map(() => result);
}
