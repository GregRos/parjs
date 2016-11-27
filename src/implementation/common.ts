/**
 * Created by User on 21-Nov-16.
 */
export const quietReturn = Object.create(null);

export const failReturn = Object.create(null);

export namespace Issues {
    export function mixedLoudnessNotPermitted({displayName} : {displayName : string}) {
        throw new Error(`Parsers of mixed loudness are not permitted as arguments for the combinator '${displayName}'`);
    }

    export function guardAgainstInfiniteLoop({displayName} : {displayName : string}) {
        throw new Error(`The combinator '${displayName}' expected one of its arguments to change the parser state.`);
    }

    export function quietParserNotPermitted({displayName} : {displayName : string}) {
        throw new Error(`The combinator ${displayName} expected a loud parser.`);
    }
}

declare global {
    interface Array<T> {
        maybePush(o : T);
    }
}
Array.prototype.maybePush = function <T> (o : T) {
    o !== quietReturn && this.push(o);
};