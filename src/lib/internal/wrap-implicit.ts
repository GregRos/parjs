import type { Parjser } from "./parjser";

import type { CombinatorInput } from "./combinated";
import { regexp, string } from "./parser";

/** A {@link Parjser} or a literal value convertible to a {@link Parjser}. */
/**
 * @private Should Not be used from user code. Used to implement implicit parser literals.
 * @type {symbol}
 */
export const convertibleSymbol: unique symbol = Symbol("ParjsConvertibleLiteral");

/**
 * A literal type which is implicitly convertible to a parser. This normally includes the `string`
 * and `RegExp` types.
 */
export interface ConvertibleScalar<T> {
    [convertibleSymbol](): Parjser<T>;
}

declare global {
    interface String {
        [convertibleSymbol](): Parjser<string>;
    }

    interface RegExp {
        [convertibleSymbol](): Parjser<string[]>;
    }
}

/**
 * Either a Parjser or a scalar value convertible to one.
 *
 * @module parjs
 */
export type ImplicitParjser<T> = Parjser<T> | ConvertibleScalar<T>;

export function wrapImplicit<V>(scalarOrParjser: ImplicitParjser<V>): CombinatorInput<V> {
    if (typeof scalarOrParjser === "string") {
        return string(scalarOrParjser) as unknown as CombinatorInput<V>;
    } else if (scalarOrParjser instanceof RegExp) {
        return regexp(scalarOrParjser) as CombinatorInput<V>;
    } else {
        return scalarOrParjser as CombinatorInput<V>;
    }
}
