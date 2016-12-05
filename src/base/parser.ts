import {quietReturn, failReturn} from "../implementation/common";
import {ParjsParserAction, BasicParsingState} from "./action";
/**
 * Created by User on 22-Nov-16.
 */



export class ParjsBaseParser {
    constructor(public action : ParjsParserAction) {}

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