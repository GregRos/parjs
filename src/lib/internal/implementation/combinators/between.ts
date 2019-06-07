
import {ImplicitLoudParser, LoudParser, ParjsCombinator, string} from "../../../index";
import {rawCombinator} from "./combinator";
import {qthen, then, thenq} from "./sequential";
import {BaseParjsParser} from "../parser";
import {map} from "./map";
import {must} from "./must";
import {ConversionHelper} from "../convertible-literal";

/**
 * Applies `pre`, `P`, and `post` in that order and yields the result of `P`.
 * @param pre The parser to precede `P`.
 * @param post The parser to proceed `P`.
 */
export function between<T>(pre: ImplicitLoudParser<any>, post: ImplicitLoudParser<any>)
    : ParjsCombinator<LoudParser<T>, LoudParser<T>>;
export function between<T>(surrounding: ImplicitLoudParser<any>)
    : ParjsCombinator<T, T>;
export function between<T>(implPre: ImplicitLoudParser<any>, implPost?: ImplicitLoudParser<any>)
    : ParjsCombinator<T, T> {
    implPost = implPost || implPre;
    let pre = ConversionHelper.convert(implPre);
    let post = ConversionHelper.convert(implPost);
    return rawCombinator(source => {
        return pre.pipe(
            qthen(source),
            thenq(post)
        );
    });
}
