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
    reason: "The primitive fail parser has been applied."
};

/**
 * Returns a parser that will always fail with the given failure info.
 * @param pFailure How the parser should fail.
 */
export function fail<T = never>(pFailure?: Partial<FailureInfo>): Parjser<T> {
    const failure = defaults(pFailure, defaultFailure);
    return new (class Fail extends ParjserBase {
        type = "fail";
        expecting = failure.reason;

        _apply(ps: ParsingState): void {
            ps.kind = failure.kind;
            ps.reason = this.expecting;
        }
    })();
}
