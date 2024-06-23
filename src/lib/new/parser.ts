import type { Applicable } from "./combinators";
import type { RuntimeOutput } from "./combinators/many/types";
import type { State } from "./state/state";
export const implementation = Symbol("implementation");

export interface ParserImpl<Output = unknown> {
    readonly type: string;
    apply(stackLabel: string, state: AnyState<any>): State<RuntimeOutput<Output>>;
    caseSense(caseSensitive: boolean): this;
}

export interface Parser<Output = unknown> {
    readonly type: string;
    readonly __Returns: Output;
    [implementation]: ParserImpl<Output>;
    parse(input: string): Output;
    /**
     * The chaining or piping operator. Applies a sequence of combinators to
     * this parser, feeding the result of one into the input of the next.
     * @param cmb1 The single combinator to apply.
     */
    pipe<const T1>(cmb1: Applicable<Output, T1>): Parser<T1>;

    /**
     * The chaining or piping operator. Applies a sequence of combinators to
     * this parser, feeding the result of one into the input of the next.
     * @param cmb1 The first combinator to apply.
     * @param cmb2 The second combinator to apply.
     */
    pipe<const T1, const T2>(cmb1: Applicable<Output, T1>, cmb2: Applicable<T1, T2>): Parser<T2>;

    /**
     * The chaining or piping operator. Applies a sequence of combinators to
     * this parser, feeding the result of one into the input of the next.
     * @param cmb1 The first combinator to apply.
     * @param cmb2 The second combinator to apply.
     * @param cmb3 The third combinator to apply.
     */
    pipe<const T1, const T2, const T3>(
        cmb1: Applicable<Output, T1>,
        cmb2: Applicable<T1, T2>,
        cmb3: Applicable<T2, T3>
    ): Parser<T3>;

    /**
     * The chaining or piping operator. Applies a sequence of combinators to
     * this parser, feeding the result of one into the input of the next.
     * @param cmb1 The first combinator to apply.
     * @param cmb2 The second combinator to apply.
     * @param cmb3 The third combinator to apply.
     * @param cmb4 The fourth combinator to apply.
     */
    pipe<const T1, const T2, const T3, const T4>(
        cmb1: Applicable<Output, T1>,
        cmb2: Applicable<T1, T2>,
        cmb3: Applicable<T2, T3>,
        cmb4: Applicable<T3, T4>
    ): Parser<T4>;

    /**
     * The chaining or piping operator. Applies a sequence of combinators to
     * this parser, feeding the result of one into the input of the next.
     * @param cmb1 The first combinator to apply.
     * @param cmb2 The second combinator to apply.
     * @param cmb3 The third combinator to apply.
     * @param cmb4 The fourth combinator to apply.
     * @param cmb5 The fifth combinator to apply.
     */
    pipe<const T1, const T2, const T3, const T4, const T5>(
        cmb1: Applicable<Output, T1>,
        cmb2: Applicable<T1, T2>,
        cmb3: Applicable<T2, T3>,
        cmb4: Applicable<T3, T4>,
        cmb5: Applicable<T4, T5>
    ): Parser<T5>;

    /**
     * The chaining or piping operator. Applies a sequence of combinators to
     * this parser, feeding the result of one into the input of the next.
     * @param cmb1 The first combinator to apply.
     * @param cmb2 The second combinator to apply.
     * @param cmb3 The third combinator to apply.
     * @param cmb4 The fourth combinator to apply.
     * @param cmb5 The fifth combinator to apply.
     * @param cmb6 The sixth combinator to apply.
     */
    pipe<const T1, const T2, const T3, const T4, const T5, const T6>(
        cmb1: Applicable<Output, T1>,
        cmb2: Applicable<T1, T2>,
        cmb3: Applicable<T2, T3>,
        cmb4: Applicable<T3, T4>,
        cmb5: Applicable<T4, T5>,
        cmb6: Applicable<T5, T6>
    ): Parser<T6>;
}
