/**
 * @module parjs/internal
 */
/** */
import {ResultKind} from "./result";
import {Parjser} from "./parjser";


/**
 * Container type for user state data.
 */
export interface UserState {
    [key: string]: any;
}

/**
 * Maintains progress for parsing a single input.
 */
export interface ParsingState {
    /**
     * The original string input on which parsing is performed. Should not be mutated while parsing.
     */
    readonly input: string;
    /**
     * The next character waiting to be parsed.
     */
    position: number;
    /**
     * The value from the last parser action performed on this state.
     */
    value: any;
    /**
     * Additional state data.
     */
    userState: UserState;

    /**
     * Initial user state.
     */
    readonly initialUserState: any;

    /**
     * A stack that indicates entered parsers. Should not be modified by user code.
     */
    stack: Parjser<any>[];

    /**
     * If the result is a failure, this field will indicate the reason for the failure.
     * If the result is OK, this must be undefined.
     */
    reason: string | object;
    /**
     * The result of the last parser action: OK, SoftFailure, HardFailure, FatalFailure.
     */
    kind: ResultKind;
    /**
     * Shorthand for this.result == Okay
     */
    readonly isOk: boolean;
    /**
     * Shorthand for this.result == SoftFailure
     */
    readonly isSoft: boolean;
    /**
     * Shorthand for this.result == HardFailure
     */
    readonly isHard: boolean;
    /**
     * Shorthand for this.result == FatalFailure
     */
    readonly isFatal: boolean;

    atLeast(kind: ResultKind);

    atMost(kind: ResultKind);
}

function worseThan(a: ResultKind, b: ResultKind) {
    if (a === ResultKind.Ok) {
        return b === ResultKind.Ok;
    }
    if (a === ResultKind.SoftFail) {
        return b === ResultKind.SoftFail || b === ResultKind.Ok;
    }
    if (a === ResultKind.HardFail) {
        return b !== ResultKind.FatalFail;
    }
    if (a === ResultKind.FatalFail) {
        return true;
    }
}

/**
 * Basic implementation of the ParsingState interface.
 */
export class BasicParsingState implements ParsingState {
    position = 0;
    stack = [];
    initialUserState = undefined;
    userState = undefined;
    value = undefined;
    kind: ResultKind;
    reason: string;

    constructor(public input: string) {

    }

    get isOk() {
        return this.kind === ResultKind.Ok;
    }

    get isSoft() {
        return this.kind === ResultKind.SoftFail;
    }

    get isHard() {
        return this.kind === ResultKind.HardFail;
    }

    get isFatal() {
        return this.kind === ResultKind.FatalFail;
    }

    atLeast(kind: ResultKind) {
        return worseThan(this.kind, kind);
    }

    atMost(kind: ResultKind) {
        return worseThan(kind, this.kind);
    }
}

// tslint:disable:naming-convention

/**
 * A unique object value indicating the reuslt of a failed parser.
 */
export const FAIL_RESULT = Object.create(null);
/**
 * A unique object value indicating that a parser did not initialize the ParsingState's value property before terminating, which is an error.
 */
export const UNINITIALIZED_RESULT = Object.create(null);

// tslint:enable:naming-convention
