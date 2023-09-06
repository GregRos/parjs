/** @module parjs/internal */ /** */

import { ParjserBase } from "../parser";
import { Parjser, ParjsCombinator, ImplicitParjser } from "../../index";
import { ScalarConverter } from "../scalar-converter";

/**
 * Represents the given function as a Parjs combinator.
 * @param f The combinator function.
 */
export function defineCombinator<E>(f: (act: ParjserBase & Parjser<E>) => Parjser<any>) {
    return (x: ImplicitParjser<any>) => {
        const resolved = ScalarConverter.convert(x);
        return f(resolved as ParjserBase);
    };
}

/**
 * Creates a new combinator by composing a series of functions.
 * @param f1 A single function. It will be returned.
 */
export function composeCombinator<A, B>(f1: ParjsCombinator<A, B>): ParjsCombinator<A, B>;

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
        for (const f of fs) {
            last = f(last);
        }
        return last;
    };
}

/**
 * The chaining or piping operator. Applies a sequence of combinators to
 * this parser, feeding the result of one into the input of the next.
 * @param source The source parser on which to apply the combinators.
 @param cmb1 The single combinator to apply.
 */
export function pipe<T, T1>(source: ImplicitParjser<T>, cmb1: ParjsCombinator<T, T1>): Parjser<T1>;

/**
 * The chaining or piping operator. Applies a sequence of combinators to
 * this parser, feeding the result of one into the input of the next.
 * @param source The source parser on which to apply the combinators.
 @param cmb1 The first combinator to apply.
 * @param cmb2 The second combinator to apply.
 */
export function pipe<T, T1, T2>(
    source: ImplicitParjser<T>,
    cmb1: ParjsCombinator<T, T1>,
    cmb2: ParjsCombinator<T1, T2>
): Parjser<T2>;

/**
 * The chaining or piping operator. Applies a sequence of combinators to
 * this parser, feeding the result of one into the input of the next.
 * @param source The source parser on which to apply the combinators.
 @param cmb1 The first combinator to apply.
 * @param cmb2 The second combinator to apply.
 * @param cmb3 The third combinator to apply.
 */
export function pipe<T, T1, T2, T3>(
    source: ImplicitParjser<T>,
    cmb1: ParjsCombinator<T, T1>,
    cmb2: ParjsCombinator<T1, T2>,
    cmb3: ParjsCombinator<T2, T3>
): Parjser<T3>;

/**
 * The chaining or piping operator. Applies a sequence of combinators to
 * this parser, feeding the result of one into the input of the next.
 * @param source The source parser on which to apply the combinators.
 @param cmb1 The first combinator to apply.
 * @param cmb2 The second combinator to apply.
 * @param cmb3 The third combinator to apply.
 * @param cmb4 The fourth combinator to apply.
 */
export function pipe<T, T1, T2, T3, T4>(
    source: ImplicitParjser<T>,
    cmb1: ParjsCombinator<T, T1>,
    cmb2: ParjsCombinator<T1, T2>,
    cmb3: ParjsCombinator<T2, T3>,
    cmb4: ParjsCombinator<T3, T4>
): Parjser<T4>;

/**
 * The chaining or piping operator. Applies a sequence of combinators to
 * this parser, feeding the result of one into the input of the next.
 * @param source The source parser on which to apply the combinators.
 @param cmb1 The first combinator to apply.
 * @param cmb2 The second combinator to apply.
 * @param cmb3 The third combinator to apply.
 * @param cmb4 The fourth combinator to apply.
 * @param cmb5 The fifth combinator to apply.
 */
export function pipe<T, T1, T2, T3, T4, T5>(
    source: ImplicitParjser<T>,
    cmb1: ParjsCombinator<T, T1>,
    cmb2: ParjsCombinator<T1, T2>,
    cmb3: ParjsCombinator<T2, T3>,
    cmb4: ParjsCombinator<T3, T4>,
    cmb5: ParjsCombinator<T4, T5>
): Parjser<T5>;

/**
 * The chaining or piping operator. Applies a sequence of combinators to
 * this parser, feeding the result of one into the input of the next.
 * @param source The source parser on which to apply the combinators.
 @param cmb1 The first combinator to apply.
 * @param cmb2 The second combinator to apply.
 * @param cmb3 The third combinator to apply.
 * @param cmb4 The fourth combinator to apply.
 * @param cmb5 The fifth combinator to apply.
 * @param cmb6 The sixth combinator to apply.
 */
export function pipe<T, T1, T2, T3, T4, T5, T6>(
    source: ImplicitParjser<T>,
    cmb1: ParjsCombinator<T, T1>,
    cmb2: ParjsCombinator<T1, T2>,
    cmb3: ParjsCombinator<T2, T3>,
    cmb4: ParjsCombinator<T3, T4>,
    cmb5: ParjsCombinator<T4, T5>,
    cmb6: ParjsCombinator<T5, T6>
): Parjser<T6>;

export function pipe(source: any, ...funcs: ((x: any) => any)[]) {
    let last = ScalarConverter.convert(source);
    for (const func of funcs) {
        last = func(last);
    }
    return last;
}
