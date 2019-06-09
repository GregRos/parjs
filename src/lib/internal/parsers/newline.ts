/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ReplyKind} from "../../reply";
import {ParsingState} from "../state";
import {Parjser} from "../../loud";
import {ParjserBase} from "../parser";
import {
    uniIsNewline,
    AsciiCodes

} from "char-info";
export function innerNewline(unicodeRecognizer: (x: number) => boolean): Parjser<string> {
    return new class Newline extends ParjserBase {
        expecting = "newline";
        type = "newline";
        _apply(ps: ParsingState) {
            let {position, input} = ps;
            if (position >= input.length) {
                ps.kind = ReplyKind.SoftFail;
                return;
            }
            let charAt = input.charCodeAt(position);

            if (charAt === AsciiCodes.newline) {
                ps.position++;
                ps.value = "\n";
                ps.kind = ReplyKind.Ok;
                return;
            } else if (charAt === AsciiCodes.carriageReturn) {
                position++;
                if (position < input.length && input.charCodeAt(position) === AsciiCodes.newline) {
                    ps.position = position + 1;
                    ps.value = "\r\n";
                    ps.kind = ReplyKind.Ok;
                    return;
                }
                ps.position = position;
                ps.value = "\r";
                ps.kind = ReplyKind.Ok;
                return;
            } else if (unicodeRecognizer && unicodeRecognizer(charAt)) {
                ps.position++;
                ps.value = input.charAt(position);
                ps.kind = ReplyKind.Ok;
                return;
            }
            ps.kind = ReplyKind.SoftFail;
        }
    }();
}

export function newline() {
    return innerNewline(null);
}


export function uniNewline() {
    return innerNewline(uniIsNewline.code);
}

