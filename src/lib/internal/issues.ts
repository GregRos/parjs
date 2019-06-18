/**
 * @module parjs/internal
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
    export function guardAgainstInfiniteLoop(name: string): never {
        throw new ParserDefinitionError(name, `The combinator '${name}' expected one of its arguments to change the parser state.`);
    }

    export function delayedParserNotInit(name: string): never {
        throw new ParserDefinitionError(name, `Delayed parser not initalized.`);
    }

    export function delayedParserAlreadyInit(): never {
        throw new ParserDefinitionError("", `Delayed parser has already been initialized`);
    }

}
