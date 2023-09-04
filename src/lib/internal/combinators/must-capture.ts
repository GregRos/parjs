/**
 * @module parjs/combinators
 */
/** */

import { FailureInfo } from "../result";
import { ParsingState } from "../state";

import { ParjsCombinator } from "../../index";
import { defineCombinator } from "./combinator";
import { ParjserBase } from "../parser";

import defaults from "lodash/defaults";
const defaultFailure: FailureInfo = {
    reason: "succeeded without capturing input",
    kind: "Hard"
};

/**
 * Applies the source parser and makes sure it captured some input.
 * @param pFailure The failure info.
 */
export function mustCapture<T>(pFailure?: Partial<FailureInfo>): ParjsCombinator<T, T> {
    const failure = defaults(pFailure, defaultFailure);
    return defineCombinator(source => {
        return new (class MustCapture extends ParjserBase {
            expecting = `expecting internal parser ${source.type} to consume input`;
            type = "mustCapture";
            _apply(ps: ParsingState) {
                const { position } = ps;
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                if (position === ps.position) {
                    ps.kind = failure.kind;
                    ps.reason = failure.reason;
                }
            }
        })();
    });
}
