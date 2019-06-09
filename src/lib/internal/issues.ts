/**
 * @module parjs/internal/implementation
 */ /** */

import {ParserDefinitionError} from "../errors";

/**
 * @external
 */
export namespace Issues {

    export function stringWrongLength(name: string, lengthHint: string) {
        throw new ParserDefinitionError(name, `The parser ${name} accepts only strings of length ${lengthHint}`);
    }
    export function guardAgainstInfiniteLoop(name: string) {
        throw new ParserDefinitionError(name, `The combinator '${name}' expected one of its arguments to change the parser state.`);
    }

    export function expectedFailureKind(name: string) {
        throw new ParserDefinitionError(name, `The combinator ${name} expected a failure kind.`);
    }

    export function willAlwaysFail(name: string) {
        throw new ParserDefinitionError(name, `The parameters given to ${name} will cause it to always fail.`);
    }
}
