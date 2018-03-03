/**
 * @module parjs/internal/implementation
 */ /** */

/**
 * An error thrown to indicate that a parser has been constructed inappropriately.
 */
export class ParserDefinitionError extends Error {
    constructor(public parserName : string, message : string) {
        super(message);
    }
}

/**
 * @external
 */
export namespace Issues {

    export function stringWrongLength(name : string, lengthHint : string) {
        throw new ParserDefinitionError(name, `The parser ${name} accepts only strings of length ${lengthHint}`);
    }

    export function mixedLoudnessNotPermitted(name : string) {
        throw new ParserDefinitionError(name, `Parsers of mixed loudness are not permitted as arguments for the combinator '${name}'`);
    }

    export function guardAgainstInfiniteLoop(name : string) {
        throw new ParserDefinitionError(name, `The combinator '${name}' expected one of its arguments to change the parser state.`);
    }

    export function quietParserNotPermitted(name : string) {
        throw new ParserDefinitionError(name, `The combinator ${name} expected a loud parser.`);
    }

    export function expectedFailureKind(name : string) {
        throw new ParserDefinitionError(name, `The combinator ${name} expected a failure kind.`);
    }

    export function willAlwaysFail(name : string) {
        throw new ParserDefinitionError(name, `The parameters given to ${name} will cause it to always fail.`);
    }
}