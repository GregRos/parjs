/**
 * @module parjs/combinators
 */
/** */

import {FailureInfo, ResultKind} from "../result";
import {ParsingState} from "../state";

import {ParjsCombinator} from "../../index";
import {defineCombinator} from "./combinator";
import {ParjserBase} from "../parser";

import defaults from "lodash/defaults";
const defaultRejection: FailureInfo = {
    reason: "succeeded without capturing input",
    kind: "Hard"
};

/**
 * Applies the source parser and makes sure it captured some input.
 * @param rejection The rejection info.
 */
export function mustCapture<T>(rejection?: Partial<FailureInfo>): ParjsCombinator<T, T> {
    rejection = defaults(rejection, defaultRejection);
    return defineCombinator(source => {
        return new class MustCapture extends ParjserBase {
            expecting = `expecting internal parser ${source.type} to consume input`;
            type = "mustCapture";
            _apply(ps: ParsingState) {
                let {position} = ps;
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                if (position === ps.position) {
                    ps.kind = rejection.kind;
                    ps.reason = rejection.reason;
                }

            }
        }();
    });
}
