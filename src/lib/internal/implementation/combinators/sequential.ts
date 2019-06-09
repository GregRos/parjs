/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ReplyKind} from "../../../reply";
import {ParsingState} from "../state";
import {ParjsCombinator} from "../../../";
import {LoudParser} from "../../../loud";
import {ImplicitLoudParser} from "../../../convertible-literal";

import {composeCombinator, defineCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";
import {LiteralConverter} from "../convertible-literal";
import {map} from "./map";


/**
 * Applies the source parser followed by `next`. Yields the result of
 * `next`.
 * @param next
 */
export function qthen<T>(next: ImplicitLoudParser<T>)
    : ParjsCombinator<any, T> {
    return composeCombinator(
        then(next),
        map(arr => arr[1])
    );
}

/**
 * Applies the source parser followed by `next`. Yields the result of
 * the source parser.
 * @param next
 */
export function thenq<T>(next: ImplicitLoudParser<any>)
    : ParjsCombinator<T, T> {
    return composeCombinator(
        then(next),
        map(arr => arr[0])
    );
}

/**
 * Applies the source parser followed by `next`. Yields the results of
 * both in an array.
 * @param next
 */
export function then<A, B>(next: ImplicitLoudParser<B>)
    : ParjsCombinator<A, [A, B]>;

export function then<A, B, C>(
    next1: ImplicitLoudParser<B>,
    next2: ImplicitLoudParser<C>
)
    : ParjsCombinator<A, [A, B, C]>;

export function then<A, B, C, D>(
    next1: ImplicitLoudParser<B>,
    next2: ImplicitLoudParser<C>,
    next3: ImplicitLoudParser<D>
)
    : ParjsCombinator<A, [A, B, C, D]>;

export function then(...parsers: ImplicitLoudParser<any>[]) {
    let resolvedParsers = parsers.map(x => LiteralConverter.convert(x) as any as BaseParjsParser);
    return defineCombinator(source => {
        resolvedParsers.splice(0, 0, source);

        return new class Then extends BaseParjsParser {
            type = "then";
            expecting = source.expecting;

            _apply(ps: ParsingState): void {
                let results = [];
                let origPos = ps.position;
                for (let i = 0; i < resolvedParsers.length; i++) {
                    let cur = resolvedParsers[i];
                    cur.apply(ps);
                    if (ps.isOk) {
                        results.push(ps.value);
                    } else if (ps.isSoft && origPos === ps.position) {
                        //if the first parser failed softly then we propagate a soft failure.
                        return;
                    } else if (ps.isSoft) {
                        ps.kind = ReplyKind.HardFail;
                        //if a i > 0 parser failed softly, this is a hard fail for us.
                        //also, propagate the internal expectation.
                        return;
                    } else {
                        //ps failed hard or fatally. The same severity.
                        return;
                    }
                }
                ps.value = results;
                ps.kind = ReplyKind.Ok;
            }

        }();
    });
}
