import {LoudParser} from "./loud";
import {Parjs} from "./index";
import {AnyParser} from "./any";

export const convertibleSymbol = Symbol("ParjsConvertibleLiteral");

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

export type ImplicitLoudParser<T> = LoudParser<T> | ConvertibleLiteral<T>;

export module ConversionHelper {
    export function convert(x : ImplicitAnyParser) : AnyParser;
    export function convert<V>(x : ImplicitLoudParser<V>) : LoudParser<V> {
        if (typeof x === "string") {
            return Parjs.string(x) as any;
        } else if (x instanceof RegExp) {
            return Parjs.regexp(x) as any;
        }else {
            return x as LoudParser<V>;
        }
    }

    export function isConvertibleFromLiteral(x : any) : boolean {
        return typeof x === "string" || x instanceof RegExp;
    }
}

export type ImplicitAnyParser = AnyParser | ConvertibleLiteral<any>;

