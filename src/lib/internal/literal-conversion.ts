/**
 * @module parjs/internal
 *
 */ /** */


import {LoudParser} from "../loud";

import {string} from "./index";
import {regexp} from "./parsers/regexp";

/**
 * A {@link LoudParser} or a literal value convertible to a {@link LoudParser}.
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
    [convertibleSymbol](): LoudParser<T>;

}

declare global {
    interface String {
        [convertibleSymbol](): LoudParser<string>;
    }

    interface RegExp {
        [convertibleSymbol](): LoudParser<string>;
    }
}
export type ImplicitLoudParser<T> = LoudParser<T> | ConvertibleLiteral<T>;

export namespace LiteralConverter {
    export function convert<V>(x: ImplicitLoudParser<V>): LoudParser<V> {
        if (typeof x === "string") {
            return string(x) as any;
        } else if (x instanceof RegExp) {
            return regexp(x) as any;
        } else {
            return x as LoudParser<V>;
        }
    }

    export function isConvertibleFromLiteral(x: any): boolean {
        return typeof x === "string" || x instanceof RegExp;
    }
}
