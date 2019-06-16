/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ParsingState} from "../state";
import {RejectionInfo} from "../reply";
import {ParjsPredicate} from "../../parjser";
import {ParjsCombinator} from "../../";
import {defineCombinator} from "./combinator";
import {ParjserBase} from "../parser";
import defaults from "lodash/defaults";

const defaultRejection: RejectionInfo = {
    kind: "Hard",
    reason: "failed to fulfill unnamed predicate"
};

/**
 * Applies the source parser and makes sure its result fulfills `predicate`.
 * @param predicate The condition to check for.
 * @param rejection
 */
export function must<T>(predicate: ParjsPredicate<T>, rejection ?: Partial<RejectionInfo>)
    : ParjsCombinator<T, T> {
    rejection = defaults(rejection, defaultRejection);
    return defineCombinator(source => {
        return new class Must extends ParjserBase {
            type = "must";
            expecting = `internal parser ${source.type} yielding a result satisfying condition`; // TODO better

            _apply(ps: ParsingState): void {
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                if (!predicate(ps.value, ps.userState)) {
                    ps.kind = rejection.kind;
                    ps.reason = rejection.reason;
                }
            }

        }();
    });
}

/**
 * Applies the source parser, and makes sure it yields a result in `args`.
 * @param args A set of allowed results.
 */
export function mustBeOf<T>(...args: T[])
    : ParjsCombinator<T, T> {
    return must(x => args.indexOf(x) >= 0);
}

/**
 * Applies the source parser and makes sure it does not yield a result in `args`.
 * @param args
 */
export function mustNotBeOf<T>(...args: T[])
    : ParjsCombinator<T, T> {
    return must(x => args.indexOf(x) < 0);
}
