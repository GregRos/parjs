/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ReplyKind} from "../../reply";
import {ParsingState} from "../state";
import {Issues} from "../issues";
import {ParjserBase} from "../parser";
import {Parjser} from "../../loud";

export function fail<T = never>(expecting: string, kind: ReplyKind): Parjser<T> {
    return new class Fail extends ParjserBase {
        type = "fail";
        expecting = expecting;

        _apply(ps: ParsingState): void {
            ps.kind = kind;
            ps.expecting = this.expecting;
        }
    }();
}
