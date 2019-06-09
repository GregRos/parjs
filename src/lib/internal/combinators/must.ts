/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ParsingState} from "../state";
import {ReplyKind} from "../../reply";
import {Parjser, ParjsPredicate} from "../../loud";
import {ParjsCombinator} from "../../";
import {defineCombinator} from "./combinator";
import {ParjserBase} from "../parser";


//TODO: do sth with reason
/**
 * Applies the source parser and makes sure its result fulfills `predicate`.
 * @param predicate The condition to check for.
 * @param reason
 * @param fail
 */
export function must<T>(predicate: ParjsPredicate<T>, reason?: string, fail ?: ReplyKind.Fail)
    : ParjsCombinator<T, T>;

export function must(req: any, reason?: string, fail = ReplyKind.HardFail) {
    return defineCombinator(source => {
        return new class Must extends ParjserBase {
            type = "must";
            expecting = `internal parser ${source.type} yielding a result satisfying condition`; // TODO better

            _apply(ps: ParsingState): void {
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
    : ParjsCombinator<T, T> {
    return must(x => args.indexOf(x) >= 0);
}

export function mustNotBeOf<T>(...args: T[])
    : ParjsCombinator<T, T> {
    return must(x => args.indexOf(x) < 0);
}
