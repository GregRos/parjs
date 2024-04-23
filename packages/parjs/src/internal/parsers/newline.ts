import { AsciiCodes, uniIsNewline } from "char-info";
import type { Parjser } from "../parjser";
import { ParjserBase } from "../parser";
import { ResultKind } from "../result";
import type { ParsingState } from "../state";

class Newline extends ParjserBase<string> {
    type = "newline";
    expecting = "expecting newline";

    constructor(private _unicodeRecognizer?: (x: number) => boolean) {
        super();
    }

    _apply(ps: ParsingState) {
        const { position, input } = ps;
        if (position >= input.length) {
            ps.kind = ResultKind.SoftFail;
            return;
        }

        const pair = input.slice(position, position + 2);

        if (pair === "\r\n") {
            ps.position += 2;
            ps.value = pair;
            ps.kind = ResultKind.Ok;
            return;
        }
        const firstChar = pair.charCodeAt(0);
        if (
            firstChar === AsciiCodes.newline ||
            firstChar === AsciiCodes.carriageReturn ||
            this._unicodeRecognizer?.(firstChar)
        ) {
            ps.position++;
            ps.value = pair[0];
            ps.kind = ResultKind.Ok;
            return;
        }
        ps.kind = ResultKind.SoftFail;
    }
}

/**
 * Parses an ASCII newline, which can be a single character or the sequence `\r\n`. Yields the text
 * that was parsed.
 */
export function newline(): Parjser<string> {
    return new Newline();
}

/**
 * Parses a Unicode newline, which includes ASCII newline strings as well as other vertical
 * separators such as PARAGRAPH SEPARATOR.
 */
export function uniNewline(): Parjser<string> {
    return new Newline(uniIsNewline.code);
}
