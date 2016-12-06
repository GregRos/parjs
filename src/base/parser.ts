import {QUIET_RESULT, FAIL_RESULT} from "../implementation/common";
import {ParjsAction, BasicParsingState} from "./action";
/**
 * Created by User on 22-Nov-16.
 */


/**
 * The base Parjs parser class, which supports only basic parsing operations. Should not be used in user code.
 */
export class BaseParjsParser {
    constructor(public action : ParjsAction) {}

    parse(input : string) : any {
        let {action, isLoud} = this;
        let ps = new BasicParsingState(input);

        if (action.apply(ps) && ps.position === input.length) {
            if (isLoud) {
                return {
                    result : ps.value,
                    state : ps.state,
                    hasResult : true
                } as ValueResult<any>;
            } else {
                return {
                    state : ps.state,
                    hasResult : false
                } as NoValueResult;
            }
        } else {
            return undefined;
        }
    }

    get isLoud() {
        return this.action.isLoud;
    }

}