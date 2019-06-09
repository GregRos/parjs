/**
 * @module parjs/internal/implementation/parsers
 */ /** */


import {ReplyKind} from "../../reply";
import {ParsingState} from "../state";
import {ParjserBase} from "../parser";
import {Parjser} from "../../parjser";

/**
 * Returns a parser that parses one character, and checks its code fulfills `predicate`.
 * @param predicate
 * @param property
 */
export function charCodeWhere(predicate: (char: number) => boolean, property = "(a specific property)"): Parjser<string> {
    return new class CharCodeWhere extends ParjserBase {
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

