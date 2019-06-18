/**
 * Building-block parsers.
 * @module parjs
 * @preferred
 */ /** iooi*/

import {Parjser} from "./internal/parjser";
import {ImplicitParjser} from "./internal/scalar-converter";

export {UserState} from "./internal/state";
export {Parjser} from "./internal/parjser";

export {ResultKind, ParjsResult} from "./internal/result";

export {
    anyStringOf,
    stringLen,
    string,
    state,
    rest,
    result,
    regexp,
    position,
    newline,
    int,
    IntOptions,
    FloatOptions,
    float,
    fail,
    eof,
    charWhere,
    charCodeWhere,
    noCharOf,
    anyCharOf,
    anyChar,
    whitespace,
    uniNewline
} from "./internal/parsers";

/**
 * A combinator or operator that takes a source parser that returns a new parser
 * based on it.
 */
export interface ParjsCombinator<TFrom, TTo> {
    (from: ImplicitParjser<TFrom>): Parjser<TTo>;
}
export {ImplicitParjser} from "./internal/scalar-converter";
export {ConvertibleScalar} from "./internal/scalar-converter";
