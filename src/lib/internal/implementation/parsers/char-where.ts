/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ReplyKind} from "../../../reply";
import {LoudParser, ParjsProjection} from "../../../loud";
import {BaseParjsParser} from "../parser";

export function charWhere(predicate: ParjsProjection<string, boolean>, expecting = "(some property)"): LoudParser<string> {
    return new class CharWhere extends BaseParjsParser {
        displayName = "charWhere";
        expecting = `a char matching: ${expecting}`;

        _apply(ps: ParsingState): void {
            let {position, input} = ps;
            if (position >= input.length) {
                ps.kind = ReplyKind.SoftFail;
                return;
            }
            let curChar = input[position];
            if (!predicate(curChar, ps.userState)) {
                ps.kind = ReplyKind.SoftFail;
                return;
            }
            ps.value = curChar;
            ps.position++;
            ps.kind = ReplyKind.Ok;
        }

    }();
}

