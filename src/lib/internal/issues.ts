/**
 * @module parjs/internal/implementation
 */ /** */

import {ParserDefinitionError} from "../errors";

/**
 * @external
 */
export namespace Issues {

    export function guardAgainstInfiniteLoop(name: string) {
        throw new ParserDefinitionError(name, `The combinator '${name}' expected one of its arguments to change the parser state.`);
    }

}
