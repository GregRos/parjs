/**
 * @module parjs/internal
 *
 */ /** */


import {Parjser} from "../parjser";

import {string} from "./index";
import {regexp} from "./parsers/regexp";

/**
 * A {@link Parjser} or a literal value convertible to a {@link Parjser}.
 */
/**
 * @private
 * Should not be used from user code. Used to implement implicit parser literals.
 * @type {symbol}
 */
export const convertibleSymbol = Symbol("ParjsConvertibleLiteral");

/**
 * A literal type which is implicitly convertible to a parser.
 * This normally includes the `string` and `RegExp` types.
 */
export interface ConvertibleLiteral<T> {
    [convertibleSymbol](): Parjser<T>;

}

declare global {
    interface String {
        [convertibleSymbol](): Parjser<string>;
    }

    interface RegExp {
        [convertibleSymbol](): Parjser<string>;
    }
}
export type ImplicitLoudParser<T> = Parjser<T> | ConvertibleLiteral<T>;

export namespace LiteralConverter {
    export function convert<V>(x: ImplicitLoudParser<V>): Parjser<V> {
        if (typeof x === "string") {
            return string(x) as any;
        } else if (x instanceof RegExp) {
            return regexp(x) as any;
        } else {
            return x as Parjser<V>;
        }
    }

    export function isConvertibleFromLiteral(x: any): boolean {
        return typeof x === "string" || x instanceof RegExp;
    }
}
