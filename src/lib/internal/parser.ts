/**
 * @module parjs/internal
 */
/** */

import {ParjsRejection, ParjsResult, ResultKind, ParjsSuccess, Trace} from "./result";
import {BasicParsingState, FAIL_RESULT, ParsingState, UNINITIALIZED_RESULT} from "./state";
import defaults from "lodash/defaults";
import {ParserDefinitionError} from "../errors";
import {Parjser} from "./parjser";


function getErrorLocation(ps: ParsingState) {
    let endln = /\r\n|\n|\r/g;
    let {input, position} = ps;
    let lastPos = 0;
    let result: RegExpMatchArray;
    let line = 0;

    while (!!(result = endln.exec(ps.input)) && result.index <= position) {
        lastPos = result.index + result[0].length;
        line++;
    }

    return {
        row: line,
        column: line === 0 ? position : position - lastPos
    };
}

class ParserUserState {

}

/**
 * The base Parjs parser class, which supports only basic parsing operations. Should not be used in user code.
 */
export abstract class ParjserBase implements Parjser<any>{
    abstract type: string;
    abstract expecting: string | object;

    /**
     * Apply the parser to the given state.
     * @param ps The parsing state.
     */
    apply(ps: ParsingState): void {
        let {position, userState} = ps;

        // we do this to verify that the ParsingState's fields have been correctly set by the parser.
        ps.kind = ResultKind.Unknown;
        ps.reason = undefined;
        ps.value = UNINITIALIZED_RESULT;
        this._apply(ps);
        if (ps.kind === ResultKind.Unknown) {
            throw new ParserDefinitionError(this.type, "the parser's result kind field has not been set.");
        }
        if (!ps.isOk) {
            ps.value = FAIL_RESULT;
            ps.reason = ps.reason || this.expecting;

        } else if (ps.value === UNINITIALIZED_RESULT) {
            throw new ParserDefinitionError(this.type, "a parser must set the result's value field if it succeeds.");
        }

        if (!ps.isOk) {
            if (ps.reason == null) {
                throw new ParserDefinitionError(this.type, "a rejection must have a reason");
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

    parse(input: string, initialState ?: any): ParjsResult<any> {

        if (typeof input !== "string") {
            // catches input === undefined, null
            throw new Error("input must be a valid string");
        }
        let ps = new BasicParsingState(input);
        ps.userState = defaults(new ParserUserState(), initialState);
        ps.initialUserState = initialState;
        this.apply(ps);

        if (ps.isOk) {
            if (ps.position !== input.length) {
                ps.kind = ResultKind.SoftFail;
                ps.reason = "parsers did not consume all input";
            }
        }
        if (ps.kind === ResultKind.Unknown) {
            throw new Error("should not happen.");
        }
        let ret: ParjsResult<any>;
        if (ps.kind === ResultKind.Ok) {
            return new ParjsSuccess(ps.value);
        } else {
            let trace: Trace = {
                userState: ps.userState,
                position: ps.position,
                reason: ps.reason,
                input,
                get location() {
                    return getErrorLocation(ps);
                },
                stackTrace: ps.stack,
                kind: ps.kind
            };

            return new ParjsRejection(trace);
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
