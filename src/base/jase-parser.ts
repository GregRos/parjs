import {quietReturn, failReturn} from "../implementation/common";
import {JaseParserAction} from "./parser-action";
/**
 * Created by User on 22-Nov-16.
 */

export class JaseBaseParser {
    constructor(public action : JaseParserAction) {}

    parse(input : string) : any {
        let {action, isLoud} = this;
        let ps : ParsingState = {
            input : input,
            position : 0,
            state : undefined,
            result : undefined,
            signal : undefined
        };

        if (action.apply(ps) && ps.position === input.length) {
            if (isLoud) {
                return {
                    result : ps.result,
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