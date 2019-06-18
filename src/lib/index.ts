/**
 * Building-block parsers.
 * @module parjs
 * @preferred
 */ /** iooi*/

import {Parjser} from "./internal/parjser";
import {ImplicitParjser} from "./internal/scalar-converter";

export {UserState} from "./internal/state";
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
    uniNewline
} from "./internal/parsers";

export {ImplicitParjser} from "./internal/scalar-converter";
export {ConvertibleScalar} from "./internal/scalar-converter";
