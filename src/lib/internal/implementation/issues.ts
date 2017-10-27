/**
 * @module parjs/internal/implementation
 */ /** */



/**
 * @external
 */
export namespace Issues {

    export function stringWrongLength(name : string, lengthHint : string) {
        throw new Error(`The parser ${name} accepts only strings of length ${lengthHint}`);
    }

    export function mixedLoudnessNotPermitted(name : string) {
        throw new Error(`Parsers of mixed loudness are not permitted as arguments for the combinator '${name}'`);
    }

    export function guardAgainstInfiniteLoop(name : string) {
        throw new Error(`The combinator '${name}' expected one of its arguments to change the parser state.`);
    }

    export function quietParserNotPermitted(name : string) {
        throw new Error(`The combinator ${name} expected a loud parser.`);
    }

    export function expectedFailureKind(name : string) {
        throw new Error(`The combinator ${name} expected a failure kind.`);
    }

    export function willAlwaysFail(name : string) {
        throw new Error(`The parameters given to ${name} will cause it to always fail.`);
    }
}