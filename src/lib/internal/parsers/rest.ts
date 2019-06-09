/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ReplyKind} from "../../reply";
import {Parjser} from "../../loud";
import {ParjserBase} from "../parser";

export function rest(): Parjser<string> {
    return new class Rest extends ParjserBase {
        expecting = "zero or more characters";
        type = "rest";
        _apply(pr: ParsingState) {
            let {position, input} = pr;
            let text = input.substr(Math.min(position, input.length));
            pr.position = input.length;
            pr.value = text;
            pr.kind = ReplyKind.Ok;
        }
    }();
}
