/**
 * Building-block parsers.
 * @module parjs
 * @preferred
 */ /** iooi*/

import {Parjser} from "./internal/parjser";
import {ImplicitParjser} from "./internal/scalar-converter";
import {DelayedParjser} from "./internal/combinators/later";

export {UserState, ParsingState} from "./internal/state";
export {Parjser, ParjsCombinator, ParjsProjection, ParjsValidator} from "./internal/parjser";

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
    uniNewline,
    upper,
    uniLetter,
    spaces1,
    space,
    lower,
    letter,
    hex,
    digit,
    uniDecimal,
    uniLower,
    uniUpper
} from "./internal/parsers";

export {ImplicitParjser} from "./internal/scalar-converter";
export {ConvertibleScalar} from "./internal/scalar-converter";
