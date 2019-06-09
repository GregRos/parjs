/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ReplyKind} from "../../reply";
import {ParjserBase} from "../parser";
import {Parjser} from "../../loud";

export function eof<T>(result?: T): Parjser<T> {
    return new class Eof extends ParjserBase {
        type = "eof";
        expecting = "end of input";

        _apply(ps: ParsingState): void {
            if (ps.position === ps.input.length) {
                ps.kind = ReplyKind.Ok;
                ps.value = result;
            } else {
                ps.kind = ReplyKind.SoftFail;
            }
        }

    }() as any;
}
