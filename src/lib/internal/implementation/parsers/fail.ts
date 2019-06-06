/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ReplyKind} from "../../../reply";
import {ParsingState} from "../state";
import {Issues} from "../issues";
import {BaseParjsParser} from "../parser";
import {LoudParser} from "../../../loud";

export function fail<T = never>(expecting: string, kind: ReplyKind): LoudParser<T> {
    return new class Fail extends BaseParjsParser {
        expecting = expecting;

        protected _apply(ps: ParsingState): void {
            ps.kind = kind;
            ps.expecting = this.expecting;
        }
    }();
}
