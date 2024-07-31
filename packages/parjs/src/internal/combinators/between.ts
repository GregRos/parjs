import type { ImplicitParjser, ParjsCombinator } from "../../index";
import { wrapImplicit } from "../parser";
import { defineCombinator } from "./combinator";
import { qthen, thenq } from "./then";

/**
 * Applies `pre`, the source parser, and then `post`. Yields the result of the source parser.
 *
 * @param pre The parser to precede the source.
 * @param post The parser to proceed the source.
 */
export function between<T>(
    pre: ImplicitParjser<unknown>,
    post: ImplicitParjser<unknown>
): ParjsCombinator<T, T>;
/**
 * Applies the `surrounding` parser, followed by the source parser, and then another instance of
 * `surrounding`. Yields the result of the source parser.
 *
 * @param surrounding The parser to apply before and after the source.
 */
export function between<T>(surrounding: ImplicitParjser<unknown>): ParjsCombinator<T, T>;
export function between<T, TPre, TPost = TPre>(
    implPre: ImplicitParjser<TPre>,
    implPost?: ImplicitParjser<TPost>
): ParjsCombinator<T, T> {
    const pre = wrapImplicit(implPre);
    const post = implPost ? wrapImplicit(implPost) : pre;
    return defineCombinator(source => {
        return pre.pipe(qthen(source), thenq(post));
    });
}
