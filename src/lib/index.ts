/**
 * Building-block parsers.
 * @example
 * import { string, anyChar, anyStringOf } from "parjs";
 * @module parjs
 * @preferred
 */ /** iooi*/

export type {
    IntOptions,
    FloatOptions,
    ParjsResult,
    Parjser,
    ParjsCombinator,
    ParjsProjection,
    ParjsValidator,
    UserState,
    SuccessInfo,
    FailureInfo,
    ErrorLocation,
    Trace
} from "./internal/index";
export {
    ResultKind,
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
    nope,
    letter,
    hex,
    digit,
    uniDecimal,
    uniLower,
    uniUpper,
    ParjsSuccess,
    ParjsFailure
} from "./internal/index";
export { ParjsError, ParjsParsingFailure, ParserDefinitionError } from "./errors";
export type { ImplicitParjser } from "./internal/scalar-converter";
export type { ConvertibleScalar } from "./internal/scalar-converter";
