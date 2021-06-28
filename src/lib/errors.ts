/**
 * Errors thrown by Parjs.
 *
 * @module parjs/errors
 * @preferred
 *
 *
 */
/** */
import {ParjsFailure} from "./internal/result";

/**
 * A parent class for all errors thrown by Parjs.
 */
export abstract class ParjsError extends Error {
    name = this.constructor.name;
}

/**
 * An error that is thrown when it is assumed a parser will succeed, but it fails.
 */
export class ParjsParsingFailure extends ParjsError {
    constructor(public failure: ParjsFailure) {
        super(`Expected parsing to succeed, but it failed. Reason: ${failure.trace.reason}`);
    }
}

/**
 * An error thrown to indicate that a parser has been constructed inappropriately.
 */
export class ParserDefinitionError extends ParjsError {
    constructor(public parserName: string, message: string) {
        super(`${parserName}: ${message}`);
    }
}
