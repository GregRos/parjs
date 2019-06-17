/**
 * @module parjs
 */
/** */

import {ParsingState} from "../state";
import {RejectionInfo, ResultKind} from "../result";
import {Parjser, ParjsProjection} from "../parjser";
import {ParjserBase} from "../parser";
import defaults from "lodash/defaults";

const defaultFailure: RejectionInfo = {
    kind: "Soft",
    reason: "a character fulfilling a predicate"
};


/**
 * Returns a parser that parses a single character fulfilling `predicate`.
 * @param predicate The predicate the character has to fulfill.
 * @param rejection Optionally, specifies how the parser should act in case of
 * rejection.
 */
export function charWhere(predicate: ParjsProjection<string, boolean>, rejection?: Partial<RejectionInfo>): Parjser<string> {
    rejection = defaults(rejection, defaultFailure);
    return new class CharWhere extends ParjserBase {
        type = "charWhere";
        expecting = rejection.reason;

        _apply(ps: ParsingState): void {
            let {position, input} = ps;
            if (position >= input.length) {
                ps.kind = rejection.kind;
                return;
            }
            let curChar = input[position];
            if (!predicate(curChar, ps.userState)) {
                ps.kind = rejection.kind;
                return;
            }
            ps.value = curChar;
            ps.position++;
            ps.kind = ResultKind.Ok;
        }

    }();
}

