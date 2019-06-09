/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ResultKind} from "../../reply";
import {ParsingState} from "../state";
import {ParjserBase} from "../parser";
import {Parjser} from "../../parjser";

export function fail<T = never>(expecting: string, kind: ResultKind): Parjser<T> {
    return new class Fail extends ParjserBase {
        type = "fail";
        expecting = expecting;

        _apply(ps: ParsingState): void {
            ps.kind = kind;
            ps.expecting = this.expecting;
        }
    }();
}
