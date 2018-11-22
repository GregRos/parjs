/**
 * @module parjs/internal/implementation
 */ /** */
import {FAIL_RESULT, QUIET_RESULT, UNINITIALIZED_RESULT} from "./special-results";

import {ParsingState} from "./state";
import {ReplyKind} from "../../reply";
import {AnyParserAction} from "../action";
import {ParserDefinitionError} from "../../errors";


function worseThan(a : ReplyKind, b : ReplyKind) {
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
    kind : ReplyKind;
    expecting : string;

    constructor(public input : string) {

    }

    atLeast(kind : ReplyKind) {
        return worseThan(this.kind, kind);
    }

    atMost(kind : ReplyKind) {
        return worseThan(kind, this.kind);
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
}

/**
 * A parsing action to perform. A parsing action is a fundamental operation that mutates a ParsingState.
 */
export abstract class ParjsAction implements AnyParserAction{
    /**
     * The internal operation performed by the action. This will be overriden by derived classes.
     * @param ps
     * @private
     */
    protected abstract _apply(ps : ParsingState) : void | void;
    abstract expecting : string;
    displayName : string;

    /**
     * Perform the action on the given ParsingState. This is a wrapper around a derived action's _apply method.
     * @param ps The parsing state.
     */
    apply(ps : ParsingState) : void {
        let {position, userState} = ps;

        //we do this to verify that the ParsingState's fields have been correctly set by the action.
        ps.kind = ReplyKind.Unknown;
        ps.expecting = undefined;
        ps.value = UNINITIALIZED_RESULT;
        this._apply(ps);
        if (ps.kind === ReplyKind.Unknown) {
            throw new ParserDefinitionError(this.displayName, "the State's kind field must be set")
        }
        if (!ps.isOk) {
            ps.value = FAIL_RESULT;
            ps.expecting = ps.expecting || this.expecting;

        } else if (!this.isLoud) {
            ps.value = QUIET_RESULT;
        } else {
            if (ps.value === UNINITIALIZED_RESULT) {
                throw new ParserDefinitionError(this.displayName, "a loud parser must set the State's return value if it succeeds.")
            }
        }

        if (!ps.isOk) {
            if (ps.expecting === undefined) {
                throw new ParserDefinitionError(this.displayName, "if failure then there must be a reason");
            }
            ps.stack.push(this);
        } else {
            ps.stack = [];
        }
    }

    /**
     * Whether this action returns a value or not. Determines if the parser is loud or not.
     */
    abstract isLoud : boolean;
}

/**
 * Inherited by parser actions for basic parsers (e.g. string or numeric parsers), rather than combinators.
 */
export abstract class ParjsBasicAction extends ParjsAction {
    isLoud = true;
}