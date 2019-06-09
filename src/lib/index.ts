/**
 * The main module.
 * Contains the {@link Parjs} object and the most commonly used public interfaces.
 * @module parjs
 * @preferred
 */ /** iooi*/

import {Parjser} from "./loud";

export {UserState} from "./internal/state";
export {Parjser} from "./loud";

export {ReplyKind, Reply} from "./reply";

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

export interface ParjsCombinator<TFrom, TTo> {
    (from: Parjser<TFrom>): Parjser<TTo>;
}
export {ImplicitLoudParser} from "./internal/literal-conversion";
export {ConvertibleLiteral} from "./internal/literal-conversion";
export {visualizeTrace, TraceVisualizer} from "./internal/trace-visualizer";
