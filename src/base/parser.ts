import {QUIET_RESULT, FAIL_RESULT, Issues} from "../implementation/common";
import {ParjsAction, BasicParsingState} from "./action";
import {ResultKind, ParserResult} from "../abstract/basics/result";
/**
 * Created by User on 22-Nov-16.
 */


/**
 * The base Parjs parser class, which supports only basic parsing operations. Should not be used in user code.
 */
export abstract class BaseParjsParser {
    constructor(public action : ParjsAction) {}

    get displayName() : string   {
        return this.action.displayName;
    }

    parse(input : string, initialState ?: any) : ParserResult<any> {
        if (typeof input !== "string") {
            //catches input === undefined, null
            throw new Error("input must be a valid string");
        }
        let {action, isLoud} = this;
        let ps = new BasicParsingState(input);
        ps.state = initialState;
        action.apply(ps);

        if (ps.isOk) {
            if (ps.position !== input.length) {
                ps.kind = ResultKind.SoftFail;
                ps.expecting = "unexpected end of input";
            }
        }
        if (ps.kind === ResultKind.Unknown){
            throw new Error("should not happen.");
        }
        if (ps.kind === ResultKind.OK) {
            return {
                value : ps.value === QUIET_RESULT ? undefined : ps.value,
                state : ps.state,
                kind : ResultKind.OK
            }
        } else {
            return {
                state : ps.state,
                kind : ps.kind,
                expecting : ps.expecting
            };
        }
    }

    get isLoud() {
        return this.action.isLoud;
    }

}