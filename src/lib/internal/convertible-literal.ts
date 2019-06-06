/**
 * @module parjs/internal
 *
 */ /** */


import {LoudParser} from "../loud";

import {ImplicitLoudParser} from "../convertible-literal";
import {string} from "./implementation";
import {regexp} from "./implementation/parsers/regexp";

export namespace ConversionHelper {
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
