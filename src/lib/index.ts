/**
 * The main module.
 * Contains the {@link Parjs} object and the most commonly used public interfaces.
 * @module parjs
 * @preferred
 */ /** iooi*/

export {UserState} from "./internal/implementation/state";
export {LoudParser} from "./loud";
export {ParjsParsingFailure} from "./errors";

export {ReplyKind, Reply, QuietReply} from "./reply";
export {ConvertibleLiteral, ImplicitLoudParser} from "./convertible-literal";

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
} from "./internal/implementation/parsers";

export interface ParjsCombinator<TFrom, TTo> {
    (from: TFrom): TTo;
}
