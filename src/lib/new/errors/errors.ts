/**
 * A parent class for all errors thrown by Parjs.
 */
export abstract class ParjsError extends Error {
    override name = this.constructor.name;
    constructor(
        readonly code: string,
        message: string
    ) {
        super(message);
    }
}

/**
 * An error thrown to indicate that a parser has been constructed inappropriately.
 */
export class ParjsBuildError extends ParjsError {
    constructor(
        public parserName: string,
        code: string,
        message: string
    ) {
        super(code, `When building ${parserName}, got ${code} – ${message}`);
    }
}

export class ParjsParseError extends ParjsError {
    constructor(
        code: string,
        public reason: string
    ) {
        super(code, `Parsing failed: ${reason}`);
    }
}
