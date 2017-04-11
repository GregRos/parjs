/**
 * @module parjs/internal/implementation
 */ /** */
export const QUIET_RESULT = Object.create(null);

export const FAIL_RESULT = Object.create(null);

export const UNINITIALIZED_RESULT = Object.create(null);

/**
 * @external
 */
export namespace Issues {

    export function stringWrongLength({displayName} : {displayName : string}, lengthHint : string) {
        throw new Error(`The parser ${displayName} accepts only strings of length ${lengthHint}`);
    }

    export function mixedLoudnessNotPermitted({displayName} : {displayName : string}) {
        throw new Error(`Parsers of mixed loudness are not permitted as arguments for the combinator '${displayName}'`);
    }

    export function guardAgainstInfiniteLoop({displayName} : {displayName : string}) {
        throw new Error(`The combinator '${displayName}' expected one of its arguments to change the parser state.`);
    }

    export function quietParserNotPermitted({displayName} : {displayName : string}) {
        throw new Error(`The combinator ${displayName} expected a loud parser.`);
    }

    export function expectedFailureKind({displayName} : {displayName : string}) {
        throw new Error(`The combinator ${displayName} expected a failure kind.`);
    }

    export function willAlwaysFail({displayName} : {displayName : string}) {
        throw new Error(`The parameters given to ${displayName} will cause it to always fail.`);
    }
}

declare global {
    interface Array<T> {
        maybePush(o : T);
    }
}
Array.prototype.maybePush = function <T> (o : T) {
    o !== QUIET_RESULT && this.push(o);
};