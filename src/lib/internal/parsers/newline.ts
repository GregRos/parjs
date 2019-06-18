/**
 * @module parjs
 */
/** */

import {ResultKind} from "../result";
import {ParsingState} from "../state";
import {Parjser} from "../parjser";
import {ParjserBase} from "../parser";
import {
    uniIsNewline,
    AsciiCodes

} from "char-info";


function innerNewline(unicodeRecognizer: (x: number) => boolean): Parjser<string> {
    return new class Newline extends ParjserBase {
        expecting = "expecting newline";
        type = "newline";
        _apply(ps: ParsingState) {
            let {position, input} = ps;
            if (position >= input.length) {
                ps.kind = ResultKind.SoftFail;
                return;
            }
            let charAt = input.charCodeAt(position);

            if (charAt === AsciiCodes.newline) {
                ps.position++;
                ps.value = "\n";
                ps.kind = ResultKind.Ok;
                return;
            } else if (charAt === AsciiCodes.carriageReturn) {
                position++;
                if (position < input.length && input.charCodeAt(position) === AsciiCodes.newline) {
                    ps.position = position + 1;
                    ps.value = "\r\n";
                    ps.kind = ResultKind.Ok;
                    return;
                }
                ps.position = position;
                ps.value = "\r";
                ps.kind = ResultKind.Ok;
                return;
            } else if (unicodeRecognizer && unicodeRecognizer(charAt)) {
                ps.position++;
                ps.value = input.charAt(position);
                ps.kind = ResultKind.Ok;
                return;
            }
            ps.kind = ResultKind.SoftFail;
        }
    }();
}

/**
 * Parses an ASCII newline, which can be a single character or the sequence
 * `\r\n`. Yields the text that was parsed.
 */
export function newline() {
    return innerNewline(null);
}

/**
 * Parses a Unicode newline, which includes ASCII newline strings as well as
 * other vertical separators such as PARAGRAPH SEPARATOR.
 */
export function uniNewline() {
    return innerNewline(uniIsNewline.code);
}

