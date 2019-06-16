/**
 * @module parjs/internal/implementation/parsers
 */ /** */


import {RejectionInfo, ResultKind} from "../reply";
import {ParsingState} from "../state";
import {ParjserBase} from "../parser";
import {Parjser} from "../../parjser";
import defaults from "lodash/defaults";

const defaultFailure: RejectionInfo = {
    kind: "Soft",
    reason: "any character fulfilling a predicate"
}

/**
 * Returns a parser that parses one character, and checks its code fulfills `predicate`.
 * @param predicate
 * @param failure
 */
export function charCodeWhere(predicate: (char: number) => boolean, failure?: Partial<RejectionInfo>): Parjser<string> {
    failure = defaults(failure, defaultFailure);
    return new class CharCodeWhere extends ParjserBase {
        type = "charCodeWhere";
        expecting = failure.reason;

        _apply(ps: ParsingState): void {
            let {position, input} = ps;
            if (position >= input.length) {
                ps.kind = failure.kind;
                return;
            }
            let curChar = input.charCodeAt(position);
            if (!predicate(curChar)) {
                ps.kind = failure.kind;
                return;
            }
            ps.value = String.fromCharCode(curChar);
            ps.position++;
            ps.kind = ResultKind.Ok;
        }

    }();
}

