/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ParsingState} from "../state";
import {ReplyKind} from "../../../reply";
import {LoudParser, ParjsPredicate} from "../../../loud";
import {ParjsCombinator} from "../../../";
import {rawCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";


//TODO: do sth with reason
/**
 * Assertion combinator. Applies `P` and asserts that its result fulfills `predicate`.
 * @param predicate The condition to check for.
 * @param reason
 * @param fail
 */
export function must<T>(predicate: ParjsPredicate<T>, reason?: string, fail ?: ReplyKind.Fail)
    : ParjsCombinator<LoudParser<T>, LoudParser<T>>;

export function must(req: any, reason?: string, fail = ReplyKind.HardFail) {
    return rawCombinator(source => {
        return new class Must extends BaseParjsParser {
            displayName = "must";
            expecting = `internal parser ${source.displayName} yielding a result satisfying condition`; // TODO better

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

export function mustBeOf<T>(...args: T[])
    : ParjsCombinator<LoudParser<T>, LoudParser<T>> {
    return must(x => args.indexOf(x) >= 0);
}

export function mustNotBeOf<T>(...args: T[])
    : ParjsCombinator<LoudParser<T>, LoudParser<T>> {
    return must(x => args.indexOf(x) < 0);
}
