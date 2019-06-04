/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {QUIET_RESULT} from "../../special-results";
import {ParserDefinitionError} from "../../../../errors";
import {LoudParser} from "../../../../loud";
import {rawCombinator} from "../combinator";
import {BaseParjsParser} from "../../parser";
import {ParjsCombinator} from "../../../../loud-combinators";
import {QuietParser} from "../../../../quiet";

export function maybe(): ParjsCombinator<QuietParser, QuietParser>;

export function maybe<T>(val: T): ParjsCombinator<LoudParser<T>, LoudParser<T|null>>;
export function maybe(val?: any) {
   return rawCombinator(inner => {
       if (val !== QUIET_RESULT && !inner.isLoud) {
           throw new ParserDefinitionError("altVal", "the inner parser must be loud if an alternative value is supplied.");
       } else if (inner.isLoud && val === QUIET_RESULT) {
           throw new ParserDefinitionError("altVal", "the inner parser must be quiet if an alternative value is not supplied.");
       }
       return new class MaybeCombinator extends BaseParjsParser {
           _inner = inner;
           expecting = "blah blah blah";
           isLoud = inner.isLoud;
           displayName = "maybe";
           _apply(ps: ParsingState): void {
               inner.apply(ps);
               if (ps.isSoft) {
                   //on soft failure, set the value and result to OK
                   if (this.isLoud) ps.value = val;
                   ps.kind = ReplyKind.Ok;
               }
               //on ok/hard/fatal, propagate the result.
           }
       }();
   });
}
