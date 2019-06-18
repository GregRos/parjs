
/** @module parjs/internal */ /** */

import {ParjserBase} from "../parser";
import {Parjser, ParjsCombinator, ImplicitParjser} from "../../index";
import {ScalarConverter} from "../scalar-converter";

/**
 * Represents the given function as a Parjs combinator.
 * @param f The combinator function.
 */
export function defineCombinator(f: (act: ParjserBase) => Parjser<any>) {
    return (x: ImplicitParjser<any>) => {
        let resolved = ScalarConverter.convert(x);
        return f(resolved as ParjserBase);
    };
}

/**
 * Creates a new combinator by composing a series of functions.
 * @param f1 A single function. It will be returned.
 */
export function composeCombinator<A, B>(
    f1: ParjsCombinator<A, B>
): ParjsCombinator<A, B>;

/**
 * Creates a new combinator by composing a series of functions.
 * @param f1 The first function in the series.
 * @param f2 The 2nd function.
 */
export function composeCombinator<A, B, C>(
    f1: ParjsCombinator<A, B>,
    f2: ParjsCombinator<B, C>
): ParjsCombinator<A, C>;

/**
 * Creates a new combinator by composing a series of functions.
 * @param f1 The first function in the series.
 * @param f2 The 2nd function.
 * @param f3 The 3rd function.
 */
export function composeCombinator<A, B, C, D>(
    f1: ParjsCombinator<A, B>,
    f2: ParjsCombinator<B, C>,
    f3: ParjsCombinator<C, D>
): ParjsCombinator<A, D>;

export function composeCombinator(...fs: ParjsCombinator<any, any>[]) {
    return x => {
        let last = x;
        for (let f of fs) {
            last = f(last);
        }
        return last;
    };
}
