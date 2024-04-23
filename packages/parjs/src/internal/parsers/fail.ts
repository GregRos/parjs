/** @module parjs */
import { defaults } from "../../utils";
import type { Parjser } from "../parjser";
import { ParjserBase } from "../parser";
import type { FailureInfo } from "../result";
import type { ParsingState } from "../state";

const defaultFailure: FailureInfo = {
    kind: "Hard",
    reason: "User initiated failure."
};

/**
 * Returns a parser that fails softly with a given reason.
 *
 * @param reason The reason for the failure.
 */
export function nope<T>(reason: string): Parjser<T> {
    return fail({
        kind: "Soft",
        reason
    });
}

class Fail<T> extends ParjserBase<T> {
    type = "fail";
    expecting = this.failure.reason;
    constructor(private failure: FailureInfo) {
        super();
    }
    _apply(ps: ParsingState): void {
        ps.kind = this.failure.kind;
        ps.reason = this.expecting;
    }
}

/**
 * Returns a parser that will always fail with the given failure info.
 *
 * @param pFailure How the parser should fail.
 */
export function fail<T = never>(pFailure?: Partial<FailureInfo> | string): Parjser<T> {
    const failure =
        typeof pFailure === "string"
            ? ({ kind: "Hard", reason: pFailure } as const)
            : defaults(pFailure, defaultFailure);
    return new Fail(failure);
}
