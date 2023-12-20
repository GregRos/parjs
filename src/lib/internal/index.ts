/**
 * Implementations of the parser system and individual parsers.
 * @module parjs/internal
 * @preferred
 */ /** */
export { ParjserBase, ParserUserState } from "./parser";
export type { ParsingState, UserState } from "./state";

export { BasicParsingState } from "./state";
export { FAIL_RESULT } from "./state";
export { UNINITIALIZED_RESULT } from "./state";
export { composeCombinator, defineCombinator } from "./combinators";
export { ScalarConverter } from "./scalar-converter";
export type { Parjser, ParjsCombinator, ParjsProjection, ParjsValidator } from "./parjser";
export type { ParjsResult, ErrorLocation, FailureInfo, Trace, SuccessInfo } from "./result";
export { ResultKind, ParjsSuccess, ParjsFailure } from "./result";
export type { IntOptions, FloatOptions } from "./parsers";
export {
    anyStringOf,
    stringLen,
    state,
    rest,
    nope,
    string,
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
    letter,
    hex,
    digit,
    uniDecimal,
    uniLower,
    uniUpper
} from "./parsers";
