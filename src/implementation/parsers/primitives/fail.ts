import {JaseBaseParserAction} from "../../../base/parser-action";
/**
 * Created by lifeg on 24/11/2016.
 */

export class PrsFail extends JaseBaseParserAction {
    displayName = "fail";

    _apply(ps : ParsingState) {
        ps.result =  ResultKind.SoftFail;
    }
}