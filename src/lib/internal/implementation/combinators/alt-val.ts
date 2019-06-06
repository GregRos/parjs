/**
 * @module parjs/internal/implementation/combinators
 */
/** */

import {ParsingState} from "../state";
import {ReplyKind} from "../../../reply";
import {ParserDefinitionError} from "../../../errors";
import {LoudParser} from "../../../loud";
import {rawCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";
import {ParjsCombinator} from "../../../index";

export function maybe<T, S = undefined>(val?: S): ParjsCombinator<LoudParser<T>, LoudParser<T|S>>;
export function maybe(val = undefined) {
   return rawCombinator(inner => {
       return new class MaybeCombinator extends BaseParjsParser {
           _inner = inner;
           expecting = "blah blah blah";
           displayName = "maybe";
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
