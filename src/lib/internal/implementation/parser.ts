/**
 * @module parjs/internal/implementation
 */
/** */
import {FAIL_RESULT, UNINITIALIZED_RESULT} from "./special-results";

import {FailureReply, Reply, ReplyKind, SuccessReply, Trace} from "../../reply";
import {BasicParsingState, ParsingState} from "./state";
import _defaults from "lodash/defaults";
import {ParserDefinitionError} from "../../errors";


function getErrorLocation(ps: ParsingState) {
    let endln = /\r\n|\n|\r/g;
    let {input, position} = ps;
    let lastPos = 0;
    let oldPos = 0;
    let result: RegExpMatchArray;
    let line = 0;

    while (!!(result = endln.exec(ps.input)) && result.index <= position) {
        oldPos = lastPos;
        lastPos = result.index;
        line++;
    }

    return {
        row: line,
        column: line === 0 ? position : lastPos - oldPos
    };
}

class ParserUserState {

}

/**
 * The base Parjs parser class, which supports only basic parsing operations. Should not be used in user code.
 */
export abstract class BaseParjsParser{
    abstract type: string;
    abstract expecting: string;
    private _label: string;

    clone() {
        return new (this.constructor as any)();
    }

    /**
     * Returns this parser object's informational label.
     */
    label();
    /**
     * Mutates this parser's informational label to `lbl`, and then returns `this`.
     * @param lbl
     */
    label(lbl: string): this;

    label(newLbl?: string): this | string {
        if (newLbl == null) return this._label;
        this._label = newLbl;
        return this;
    }
    /**
     * Perform the action on the given ParsingState. This is a wrapper around a derived action's apply method.
     * @param ps The parsing state.
     */
    apply(ps: ParsingState): void {
        let {position, userState} = ps;

        //we do this to verify that the ParsingState's fields have been correctly set by the action.
        ps.kind = ReplyKind.Unknown;
        ps.expecting = undefined;
        ps.value = UNINITIALIZED_RESULT;
        this._apply(ps);
        if (ps.kind === ReplyKind.Unknown) {
            throw new ParserDefinitionError(this.type, "the State's kind field must be set");
        }
        if (!ps.isOk) {
            ps.value = FAIL_RESULT;
            ps.expecting = ps.expecting || this.expecting;

        } else {
            if (ps.value === UNINITIALIZED_RESULT) {
                throw new ParserDefinitionError(this.type, "a loud parser must set the State's return value if it succeeds.");
            }
        }

        if (!ps.isOk) {
            if (ps.expecting === undefined) {
                throw new ParserDefinitionError(this.type, "if failure then there must be a reason");
            }
            ps.stack.push(this);
        } else {
            ps.stack = [];
        }
    }

    /**
     * The internal operation performed by the action. This will be overriden by derived classes.
     * @param ps
     * @private
     */
    abstract _apply(ps: ParsingState): void | void;

    parse(input: string, initialState ?: any): Reply<any> {

        if (typeof input !== "string") {
            //catches input === undefined, null
            throw new Error("input must be a valid string");
        }
        let ps = new BasicParsingState(input);
        ps.userState = _defaults(new ParserUserState(), initialState);
        ps.initialUserState = initialState;
        this.apply(ps);

        if (ps.isOk) {
            if (ps.position !== input.length) {
                ps.kind = ReplyKind.SoftFail;
                ps.expecting = "parsers did not consume all input";
            }
        }
        if (ps.kind === ReplyKind.Unknown) {
            throw new Error("should not happen.");
        }
        let ret: Reply<any>;
        if (ps.kind === ReplyKind.Ok) {
            return new SuccessReply(ps.value);
        } else {
            let trace: Trace = {
                userState: ps.userState,
                position: ps.position,
                reason: ps.expecting,
                input,
                get location() {
                    return getErrorLocation(ps);
                },
                stackTrace: ps.stack,
                kind: ps.kind
            };

            return new FailureReply(trace);
        }
    }

    pipe(...funcs: ((x: any) => any)[]) {
        let last = this;
        for (let func of funcs) {
            last = func(last);
        }
        return last;
    }

}
