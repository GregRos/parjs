/**
 * Building-block parsers.
 * @example
 * import { string, anyChar, anyStringOf } from "parjs";
 * @module parjs
 * @preferred
 */ /** iooi*/

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
    nope,
    letter,
    hex,
    digit,
    uniDecimal,
    uniLower,
    uniUpper,
    ParjsResult,
    ParjsSuccess,
    Parjser,
    ParjsCombinator,
    ParjsProjection,
    ParjsValidator,
    UserState,
    SuccessInfo,
    ParjsFailure,
    FailureInfo,
    ErrorLocation,
    Trace
} from "./internal/index";
export { ParjsError, ParjsParsingFailure, ParserDefinitionError } from "./errors";
export { ImplicitParjser } from "./internal/scalar-converter";
export { ConvertibleScalar } from "./internal/scalar-converter";
