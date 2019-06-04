/**
 * @module parjs/internal
 *
 */ /** */

import {AnyParser} from "../any";
import {LoudParser} from "../loud";
import {Parjs} from "../index";
import {ImplicitAnyParser, ImplicitLoudParser} from "../convertible-literal";

export namespace ConversionHelper {
    export function convert(x: ImplicitAnyParser): AnyParser;
    export function convert<V>(x: ImplicitLoudParser<V>): LoudParser<V> {
        if (typeof x === "string") {
            return Parjs.string(x) as any;
        } else if (x instanceof RegExp) {
            return Parjs.regexp(x) as any;
        } else {
            return x as LoudParser<V>;
        }
    }

    export function isConvertibleFromLiteral(x: any): boolean {
        return typeof x === "string" || x instanceof RegExp;
    }
}