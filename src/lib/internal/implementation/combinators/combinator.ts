import {AnyParserAction} from "../../action";
import {AnyParser} from "../../../any";
import {BaseParjsParser} from "../parser";
import {ParjsCombinator} from "../../../loud-combinators";

export function rawCombinator(f: (act: BaseParjsParser) => BaseParjsParser) {
    return f as ParjsCombinator<any, any>;
}
