/**
 * @module parjs
 *
 *
 */ /** iooi*/


import {LoudParser} from "./loud";
import {AnyParser} from "./any";

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
export type ConvertibleLiteral<T> =  {
    [convertibleSymbol]() : LoudParser<T>

}

declare global {
    interface String {
        [convertibleSymbol]() : LoudParser<string>
    }

    interface RegExp {
        [convertibleSymbol]() : LoudParser<string>;
    }
}

/**
 * A [[LoudParser]] or a literal value convertible to a [[LoudParser]].
 */
export type ImplicitLoudParser<T> = LoudParser<T> | ConvertibleLiteral<T>;

/**
 * A [[AnyParser]] or a literal value convertible to a [[AnyParser]]
 */
export type ImplicitAnyParser = AnyParser | ConvertibleLiteral<any>;

