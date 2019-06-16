/**
 * The main module.
 * Contains the {@link Parjs} object and the most commonly used public interfaces.
 * @module parjs
 * @preferred
 */ /** iooi*/

import {Parjser} from "./parjser";

export {UserState} from "./internal/state";
export {Parjser} from "./parjser";

export {ResultKind, Reply} from "./internal/reply";

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
    (from: Parjser<TFrom>): Parjser<TTo>;
}
export {ImplicitParjser} from "./internal/literal-conversion";
export {ConvertibleLiteral} from "./internal/literal-conversion";
export {visualizeTrace, TraceVisualizer} from "./internal/trace-visualizer";
