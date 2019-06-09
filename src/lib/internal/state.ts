/**
 * @module parjs/internal
 */
/** */
import {ReplyKind} from "../reply";
import {LoudParser} from "../loud";


export interface UserState {
    [key: string]: any;
}

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
    stack: LoudParser<any>[];

    /**
     * If the result is a failure, this field will indicate the reason for the failure.
     * If the result is OK, this must be undefined.
     */
    expecting: string;
    /**
     * The result of the last parser action: OK, SoftFailure, HardFailure, FatalFailure.
     */
    kind: ReplyKind;
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

    atLeast(kind: ReplyKind);

    atMost(kind: ReplyKind);
}

function worseThan(a: ReplyKind, b: ReplyKind) {
    if (a === ReplyKind.Ok) {
        return b === ReplyKind.Ok;
    }
    if (a === ReplyKind.SoftFail) {
        return b === ReplyKind.SoftFail || b === ReplyKind.Ok;
    }
    if (a === ReplyKind.HardFail) {
        return b !== ReplyKind.FatalFail;
    }
    if (a === ReplyKind.FatalFail) {
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
    kind: ReplyKind;
    expecting: string;

    constructor(public input: string) {

    }

    get isOk() {
        return this.kind === ReplyKind.Ok;
    }

    get isSoft() {
        return this.kind === ReplyKind.SoftFail;
    }

    get isHard() {
        return this.kind === ReplyKind.HardFail;
    }

    get isFatal() {
        return this.kind === ReplyKind.FatalFail;
    }

    atLeast(kind: ReplyKind) {
        return worseThan(this.kind, kind);
    }

    atMost(kind: ReplyKind) {
        return worseThan(kind, this.kind);
    }
}
