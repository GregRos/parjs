import type { ImplicitParjser, ParjsCombinator, Parjser } from "../../index";
import type { CombinatorInput } from "../combinated";
import { wrapImplicit } from "../wrap-implicit";

/**
 * Represents the given function as a Parjs combinator.
 *
 * @param f The combinator function.
 */
export function defineCombinator<A, B>(
    f: (act: CombinatorInput<A>) => Parjser<B>
): ParjsCombinator<A, B> {
    return (x: ImplicitParjser<A>): Parjser<B> => {
        const resolved = wrapImplicit(x);
        return f(resolved);
    };
}

/**
 * Creates a new combinator by composing a series of functions.
 *
 * @param f1 A single function. It will be returned.
 */
export function composeCombinator<A, B>(f1: ParjsCombinator<A, B>): ParjsCombinator<A, B>;

/**
 * Creates a new combinator by composing a series of functions.
 *
 * @param f1 The first function in the series.
 * @param f2 The 2nd function.
 */
export function composeCombinator<A, B, C>(
    f1: ParjsCombinator<A, B>,
    f2: ParjsCombinator<B, C>
): ParjsCombinator<A, C>;

/**
 * Creates a new combinator by composing a series of functions.
 *
 * @param f1 The first function in the series.
 * @param f2 The 2nd function.
 * @param f3 The 3rd function.
 */
export function composeCombinator<A, B, C, D>(
    f1: ParjsCombinator<A, B>,
    f2: ParjsCombinator<B, C>,
    f3: ParjsCombinator<C, D>
): ParjsCombinator<A, D>;

export function composeCombinator(...fs: ParjsCombinator<unknown, unknown>[]) {
    return (x: ImplicitParjser<unknown>) => {
        let last = x;
        for (const f of fs) {
            last = f(last);
        }
        return last;
    };
}

/**
 * The chaining or piping operator. Applies a sequence of combinators to this parser, feeding the
 * result of one into the input of the next.
 *
 * @param source The source parser on which to apply the combinators.
 * @param cmb1 The single combinator to apply.
 */
export function pipe<T, T1>(source: ImplicitParjser<T>, cmb1: ParjsCombinator<T, T1>): Parjser<T1>;

/**
 * The chaining or piping operator. Applies a sequence of combinators to this parser, feeding the
 * result of one into the input of the next.
 *
 * @param source The source parser on which to apply the combinators.
 * @param cmb1 The first combinator to apply.
 * @param cmb2 The second combinator to apply.
 */
export function pipe<T, T1, T2>(
    source: ImplicitParjser<T>,
    cmb1: ParjsCombinator<T, T1>,
    cmb2: ParjsCombinator<T1, T2>
): Parjser<T2>;

/**
 * The chaining or piping operator. Applies a sequence of combinators to this parser, feeding the
 * result of one into the input of the next.
 *
 * @param source The source parser on which to apply the combinators.
 * @param cmb1 The first combinator to apply.
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
 * The chaining or piping operator. Applies a sequence of combinators to this parser, feeding the
 * result of one into the input of the next.
 *
 * @param source The source parser on which to apply the combinators.
 * @param cmb1 The first combinator to apply.
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
 * The chaining or piping operator. Applies a sequence of combinators to this parser, feeding the
 * result of one into the input of the next.
 *
 * @param source The source parser on which to apply the combinators.
 * @param cmb1 The first combinator to apply.
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
 * The chaining or piping operator. Applies a sequence of combinators to this parser, feeding the
 * result of one into the input of the next.
 *
 * @param source The source parser on which to apply the combinators.
 * @param cmb1 The first combinator to apply.
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pipe(source: any, ...funcs: ((x: any) => any)[]) {
    let last = wrapImplicit(source);
    for (const func of funcs) {
        last = func(last);
    }
    return last;
}
