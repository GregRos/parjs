import {QUIET_RESULT, FAIL_RESULT, Issues} from "../implementation/common";
import {ParjsAction, BasicParsingState} from "./action";
import {ReplyKind, Reply, SuccessReply, FailureReply, Trace} from "../abstract/basics/result";
import _ = require('lodash');
/**
 * Created by User on 22-Nov-16.
 */

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
                ps.expecting = "unexpected end of input";
            }
        }
        if (ps.kind === ReplyKind.Unknown) {
            throw new Error("should not happen.");
        }
        let ret: Reply<any>;
        if (ps.kind === ReplyKind.OK) {
            return Object.assign(new SuccessReply(ps.value === QUIET_RESULT ? undefined : ps.value))
        }
        else {
            return new FailureReply(ps.kind, {
                state: ps.state,
                position: ps.position,
                expecting: ps.expecting
            });

        }
    }

    get isLoud() {
        return this.action.isLoud;
    }

}