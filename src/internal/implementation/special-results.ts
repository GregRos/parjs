/**
 * @module parjs/internal
 */ /** */
/**
 * A unique object value indicating the result of a quiet parser.
 */
export const QUIET_RESULT = Object.create(null);

/**
 * A unique object value indicating the reuslt of a failed parser.
 */
export const FAIL_RESULT = Object.create(null);

/**
 * A unique object value indicating that a parser did not initialize the ParsingState's value property before terminating, which is an error.
 */
export const UNINITIALIZED_RESULT = Object.create(null);