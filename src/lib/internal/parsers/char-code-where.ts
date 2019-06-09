/**
 * @module parjs/internal/implementation/parsers
 */ /** */


import {ReplyKind} from "../../reply";
import {ParsingState} from "../state";
import {BaseParjsParser} from "../parser";
import {LoudParser} from "../../loud";

/**
 * Returns a parser that parses one character, and checks its code fulfills `predicate`.
 * @param predicate
 * @param property
 */
export function charCodeWhere(predicate: (char: number) => boolean, property = "(a specific property)"): LoudParser<string> {
    return new class CharCodeWhere extends BaseParjsParser {
        type = "charCodeWhere";
        expecting = `any character satisfying ${property}`;

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

