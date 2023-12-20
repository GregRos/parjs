/**
 * @module parjs/combinators
 */
/** */

import type { ParjsCombinator } from "../../";
import type { FailureInfo, ResultKindFail, SuccessInfo } from "../result";
import type { ParsingState, UserState } from "../state";

import { ParjserBase } from "../parser";
import { defineCombinator } from "./combinator";

/**
 * Information about the failure.
 */
export interface ParserFailureState {
    /**
     * The parser's user state at the moment of failure.
     */
    readonly userState: UserState;
    /**
     * The reason reported by the failure.
     */
    readonly reason: string | object;
    /**
     * The severity of the failure.
     */
    readonly kind: ResultKindFail;
}

/**
 * Function used to recover from a failure. The `kind`, `reason`, and `value`
 * fields of the result are used to determine the new parser success state.
 * You can return a falsy value to indicate nothing should change.
 */
export type RecoveryFunction<T> = (
    failure: ParserFailureState
) => SuccessInfo<T> | Partial<FailureInfo> | null;

/**
 * Reduces Hard failures to Soft ones and behaves in the same way on success.
 */
export function recover<T>(recoverFunction: RecoveryFunction<T>): ParjsCombinator<T, T> {
    return defineCombinator<unknown, T>(source => {
        return new (class Soft extends ParjserBase<T> {
            type = "recover";
            expecting = source.expecting;
            _apply(ps: ParsingState): void {
                source.apply(ps);
                if (ps.isOk || ps.isFatal) return;
                const result = recoverFunction({
                    userState: ps.userState,
                    kind: ps.kind as ResultKindFail,
                    reason: ps.reason! // the error is guaranteed to be non-null
                } satisfies ParserFailureState);
                if (!result) return;
                ps.kind = result.kind || ps.kind;
                if (result.kind === "OK") {
                    ps.value = result.value;
                } else {
                    ps.reason = result.reason || ps.reason;
                }
            }
        })();
    });
}
