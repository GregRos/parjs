
import {ImplicitLoudParser, LoudParser, ParjsCombinator, string} from "../../../index";
import {defineCombinator} from "./combinator";
import {qthen, then, thenq} from "./sequential";
import {BaseParjsParser} from "../parser";
import {map} from "./map";
import {must} from "./must";
import {ConversionHelper} from "../convertible-literal";

/**
 * Applies `pre`, the source parser, and then `post`. Yields the result of the source parser.
 * @param pre The parser to precede the source.
 * @param post The parser to proceed the source.
 */
export function between<T>(pre: ImplicitLoudParser<any>, post: ImplicitLoudParser<any>)
    : ParjsCombinator<T, T>;
export function between<T>(surrounding: ImplicitLoudParser<any>)
    : ParjsCombinator<T, T>;
export function between<T>(implPre: ImplicitLoudParser<any>, implPost?: ImplicitLoudParser<any>)
    : ParjsCombinator<T, T> {
    implPost = implPost || implPre;
    let pre = ConversionHelper.convert(implPre);
    let post = ConversionHelper.convert(implPost);
    return defineCombinator(source => {
        return pre.pipe(
            qthen(source),
            thenq(post)
        );
    });
}
