/**
 * Parser combinators.
 * @module parjs/combinators
 * @example
 * import { exactly, or, maybe, many } from "parjs/combinators
 * @preferred
 * */ /** */

export type {
    ArrayWithSeparators,
    NestedArray,
    UserStateOrProjection,
    RecoveryFunction,
    ParserFailureState,
    DelayedParjser
} from "./internal/combinators";
export {
    stringify,
    recover,
    then,
    not,
    mustCapture,
    must,
    map,
    manyTill,
    manySepBy,
    reason,
    many,
    later,
    exactly,
    backtrack,
    or,
    maybe,
    each,
    thenq,
    qthen,
    replaceState,
    between,
    flatten,
    mapConst,
    thenPick,
    manyBetween,
    pipe
} from "./internal/combinators";
