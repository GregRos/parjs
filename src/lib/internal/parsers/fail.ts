/**
 * @module parjs
 */
/** */

import {FailureInfo, ResultKind} from "../result";
import {ParsingState} from "../state";
import {ParjserBase} from "../parser";
import {Parjser} from "../parjser";
import defaults from "lodash/defaults";
const defaultRejection: FailureInfo = {
    kind: "Hard",
    reason: "The primitive fail parser has been applied."
};

/**
 * Returns a parser that will always fail with the given rejection info.
 * @param rejection How the parser should fail.
 */
export function fail<T = never>(rejection?: Partial<FailureInfo>): Parjser<T> {
    rejection = defaults(rejection, defaultRejection);
    return new class Fail extends ParjserBase {
        type = "fail";
        expecting = rejection.reason;

        _apply(ps: ParsingState): void {
            ps.kind = rejection.kind;
            ps.reason = this.expecting;
        }
    }();
}
