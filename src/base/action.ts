import {FAIL_RESULT, QUIET_RESULT, UNINITIALIZED_RESULT} from "../implementation/common";
import {assert} from 'chai';
import {ParsingState} from "../abstract/basics/state";
import {ResultKind} from "../abstract/basics/result";

export class BasicParsingState implements ParsingState {
    position = 0;
    state = undefined;
    value = undefined;
    kind : ResultKind;
    expecting : string;
    constructor(public input : string) {

    }

    get isOk() {
        return this.kind === ResultKind.OK;
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
}

/**
 * A parsing action to perform. A parsing action is a fundamental operation that mutates a ParsingState.
 */
export abstract class ParjsAction {
    /**
     * The internal operation performed by the action. This will be overriden by derived classes.
     * @param ps
     * @private
     */
    protected abstract _apply(ps : ParsingState) : void | void;
    abstract expecting : string;
    abstract displayName : string;

    /**
     * Perform the action on the given ParsingState. This is a wrapper around a derived action's _apply method.
     * @param ps The parsing state.
     */
    apply(ps : ParsingState) : void {
        let {position, state} = ps;

        //we do this to verify that the ParsingState's fields have been correctly set by the action.
        ps.kind = ResultKind.Unknown;
        ps.expecting = undefined;
        ps.value = UNINITIALIZED_RESULT;

        this._apply(ps);
        assert.notStrictEqual(ps.kind, ResultKind.Unknown, "the State's result field must be set");
        if (!ps.isOk) {
            ps.value = FAIL_RESULT;
            ps.expecting = ps.expecting || this.expecting;
        } else if (!this.isLoud) {
            ps.value = QUIET_RESULT;
        } else {
            assert.notStrictEqual(ps.value, UNINITIALIZED_RESULT, "a loud parser must set the State's return value if it succeeds.");
        }

        if (!ps.isOk) {
            assert.notStrictEqual(ps.expecting, undefined, "if failure then there must be a reason");
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