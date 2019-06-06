/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ReplyKind} from "../../../reply";
import {ParsingState} from "../state";
import {CharInfo, CodeInfo, StaticCodeInfo} from "char-info";
import {Codes} from "../functions/char-indicators";
import {LoudParser} from "../../../loud";
import {BaseParjsParser} from "../parser";

export function innerNewline(unicodeRecognizer: (x: number) => boolean): LoudParser<string> {
    return new class Newline extends BaseParjsParser {
        expecting = "newline";

        _apply(ps: ParsingState) {
            let {position, input} = ps;
            if (position >= input.length) {
                ps.kind = ReplyKind.SoftFail;
                return;
            }
            let charAt = input.charCodeAt(position);

            if (charAt === Codes.newline) {
                ps.position++;
                ps.value = "\n";
                ps.kind = ReplyKind.Ok;
                return;
            } else if (charAt === Codes.carriageReturn) {
                position++;
                if (position < input.length && input.charCodeAt(position) === Codes.newline) {
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
    return innerNewline(CodeInfo.isUniNewline);
}

