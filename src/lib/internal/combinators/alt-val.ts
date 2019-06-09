/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ParsingState} from "../state";
import {ReplyKind} from "../../reply";
import {ParserDefinitionError} from "../../errors";
import {LoudParser} from "../../loud";
import {defineCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";
import {ParjsCombinator} from "../../index";

/**
 * Applies the source parser. If it fails softly, succeeds and yields `val`.
 * @param val
 */
export function maybe<T, S = undefined>(val?: S): ParjsCombinator<T, T|S>;
export function maybe(val = undefined) {
   return defineCombinator(inner => {
       return new class MaybeCombinator extends BaseParjsParser {
           _inner = inner;
           expecting = "blah blah blah";
           type = "maybe";
           _apply(ps: ParsingState): void {
               inner.apply(ps);
               if (ps.isSoft) {
                   //on soft failure, set the value and result to OK
                   ps.value = val;
                   ps.kind = ReplyKind.Ok;
               }
               //on ok/hard/fatal, propagate the result.
           }
       }();
   });
}
