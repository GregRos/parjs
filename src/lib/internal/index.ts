/**
 * Implementations of the parser system and individual parsers.
 * @module parjs/internal
 * @preferred
 */ /** */
export { ParjserBase, ParserUserState } from "./parser";
export { ParsingState, UserState } from "./state";

export { BasicParsingState } from "./state";
export { FAIL_RESULT } from "./state";
export { UNINITIALIZED_RESULT } from "./state";
export { composeCombinator, defineCombinator } from "./combinators";
export { ScalarConverter } from "./scalar-converter";
export { Parjser, ParjsCombinator, ParjsProjection, ParjsValidator } from "./parjser";
export {
    ResultKind,
    ParjsResult,
    ParjsSuccess,
    ErrorLocation,
    FailureInfo,
    Trace,
    SuccessInfo,
    ParjsFailure
} from "./result";
export {
    anyStringOf,
    stringLen,
    state,
    rest,
    string,
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
} from "./parsers";
