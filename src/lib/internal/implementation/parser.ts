/**
 * @module parjs/internal/implementation
 */
/** */
import {QUIET_RESULT} from "./special-results";
import {BasicParsingState, ParjsAction} from "./action";
import {FailureReply, Reply, ReplyKind, SuccessReply, Trace} from "../../reply";
import {ParsingState} from "./state";
import _defaults = require("lodash/defaults");

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
export abstract class BaseParjsParser {
    constructor(public action: ParjsAction) {
    }

    get displayName(): string {
        return this.action.displayName;
    }

    set displayName(name) {
        this.action.displayName = name;
    }

    get isLoud() {
        return this.action.isLoud;
    }

    parse(input: string, initialState ?: any): Reply<any> {

        if (typeof input !== "string") {
            //catches input === undefined, null
            throw new Error("input must be a valid string");
        }
        let {action, isLoud} = this;
        let ps = new BasicParsingState(input);
        ps.userState = _defaults(new ParserUserState(), initialState);
        ps.initialUserState = initialState;
        action.apply(ps);

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
            return new SuccessReply(ps.value === QUIET_RESULT ? undefined : ps.value);
        } else {
            let location = getErrorLocation(ps);
            let trace: Trace = {
                userState: ps.userState,
                position: ps.position,
                reason: ps.expecting,
                input,
                location,
                stackTrace: ps.stack,
                kind: ps.kind
            };

            return new FailureReply(trace);
        }
    }

}