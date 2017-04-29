/**
 * @module parjs/internal/implementation
 */ /** */
import {QUIET_RESULT, FAIL_RESULT} from "./special-results";
import {Issues} from './issues';
import {ParjsAction, BasicParsingState} from "./action";
import {ReplyKind, Reply} from "../../reply";
import {Trace, FailureReply, SuccessReply, ErrorLocation} from '../reply';
import _ = require('lodash');
import {ParsingState} from "./state";

function getErrorLocation(ps : ParsingState){
    let endln = /\r\n|\n|\r/g;
    let {input, position} = ps;
    let lastPos = 0;
    let oldPos = 0;
    let result : RegExpMatchArray;
    let line = 0;

    while (!!(result = endln.exec(ps.input)) && result.index <= position) {
        oldPos = lastPos;
        lastPos = result.index;
        line++;
    }

    result = !result ? null : endln.exec(ps.input);

    return {
        row : line,
        column : line === 0 ? position : lastPos - oldPos
    };
}


class ParserState {

}

/**
 * The base Parjs parser class, which supports only basic parsing operations. Should not be used in user code.
 */
export abstract class BaseParjsParser {
    constructor(public action : ParjsAction) {}

    get displayName() : string   {
        return this.action.displayName;
    }

    set displayName(name) {
        this.action.displayName = name;
    }

    parse(input : string, initialState ?: any) : Reply<any> {

        if (typeof input !== "string") {
            //catches input === undefined, null
            throw new Error("input must be a valid string");
        }
        let {action, isLoud} = this;
        let ps = new BasicParsingState(input);
        ps.state = _.defaults(new ParserState(), initialState);
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
        if (ps.kind === ReplyKind.OK) {
            return new SuccessReply(ps.value === QUIET_RESULT ? undefined : ps.value);
        }
        else {
            let location = getErrorLocation(ps);
            let trace : Trace = {
                state: ps.state,
                position: ps.position,
                reason: ps.expecting,
                input : input,
                location : location,
                stackTrace : ps.stack,
                kind : ps.kind
            };

            return new FailureReply(trace);
        }
    }

    get isLoud() {
        return this.action.isLoud;
    }

}