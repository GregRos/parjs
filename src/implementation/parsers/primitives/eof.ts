import {ParjsParserAction, ParjsBaseParserAction} from "../../../base/action";
import {quietReturn} from "../../common";
/**
 * Created by lifeg on 24/11/2016.
 */

export class PrsEof extends ParjsBaseParserAction {
    isLoud = false;
    displayName = "eof";
    expecting = "end of input";
    _apply(ps : ParsingState) {
        if (ps.position === ps.input.length) {
            ps.result =  ResultKind.OK;
        } else {
            ps.result = ResultKind.SoftFail;
        }
    }
}