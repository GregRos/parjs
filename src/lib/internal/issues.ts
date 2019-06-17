/**
 * @module parjs/internal/implementation
 */ /** */

import {ParserDefinitionError} from "../errors";

/**
 * Some canned error throwers.
 */
export namespace Issues {

    /**
     * Throws an error saying that the parser is about to enter an infinite
     * loop.
     * @param name
     */
    export function guardAgainstInfiniteLoop(name: string) {
        throw new ParserDefinitionError(name, `The combinator '${name}' expected one of its arguments to change the parser state.`);
    }

}
