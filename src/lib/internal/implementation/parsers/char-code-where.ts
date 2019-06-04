/**
 * @module parjs/internal/implementation/parsers
 */ /** */

import {ParjsBasicAction} from "../../action";
import {ReplyKind} from "../../../../reply";
import {ParsingState} from "../../state";
import {BaseParjsParser} from "../../parser";
import {LoudParser} from "../../../../loud";

export function charCodeWhere(predicate: (char: number) => boolean, property = "(a specific property)"): LoudParser<string> {
    return new class CharCodeWhere extends BaseParjsParser {
        displayName = "charCodeWhere";
        expecting = `any character satisfying ${property}`;
        isLoud: true = true;

        _apply(ps: ParsingState): void {
            let {position, input} = ps;
            if (position >= input.length) {
                ps.kind = ReplyKind.SoftFail;
                return;
            }
            let curChar = input.charCodeAt(position);
            if (!predicate(curChar)) {
                ps.kind = ReplyKind.SoftFail;
                return;
            }
            ps.value = String.fromCharCode(curChar);
            ps.position++;
            ps.kind = ReplyKind.Ok;
        }

    }();
}

