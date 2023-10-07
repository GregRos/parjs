/**
 * @module parjs
 */
/** */

import { FailureInfo } from "../result";
import { ParsingState } from "../state";
import { ParjserBase } from "../parser";
import { Parjser } from "../parjser";
import defaults from "lodash/defaults";

const defaultFailure: FailureInfo = {
    kind: "Hard",
    reason: "User initiated failure."
};

/**
 * Returns a parser that fails softly with a given reason.
 * @param reason The reason for the failure.
 */
export function nope<T>(reason: string): Parjser<T> {
    return fail({
        kind: "Soft",
        reason
    });
}

/**
 * Returns a parser that will always fail with the given failure info.
 * @param pFailure How the parser should fail.
 */
export function fail<T = never>(pFailure?: Partial<FailureInfo> | string): Parjser<T> {
    const failure =
        typeof pFailure === "string"
            ? ({ kind: "Hard", reason: pFailure } as const)
            : defaults(pFailure, defaultFailure);
    return new (class Fail extends ParjserBase<T> {
        type = "fail";
        expecting = failure.reason;

        _apply(ps: ParsingState): void {
            ps.kind = failure.kind;
            ps.reason = this.expecting;
        }
    })();
}
