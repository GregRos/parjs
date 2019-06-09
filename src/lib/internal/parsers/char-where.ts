/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ResultKind} from "../reply";
import {Parjser, ParjsProjection} from "../../parjser";
import {ParjserBase} from "../parser";

export function charWhere(predicate: ParjsProjection<string, boolean>, expecting = "(some property)"): Parjser<string> {
    return new class CharWhere extends ParjserBase {
        type = "charWhere";
        expecting = `a char matching: ${expecting}`;

        _apply(ps: ParsingState): void {
            let {position, input} = ps;
            if (position >= input.length) {
                ps.kind = ResultKind.SoftFail;
                return;
            }
            let curChar = input[position];
            if (!predicate(curChar, ps.userState)) {
                ps.kind = ResultKind.SoftFail;
                return;
            }
            ps.value = curChar;
            ps.position++;
            ps.kind = ResultKind.Ok;
        }

    }();
}

