import {ParjsCombinator} from "../../index";
import {defineCombinator} from "./combinator";
import {BaseParjsParser} from "../parser";
import {ParsingState} from "../state";

export function label<T>(label: string): ParjsCombinator<T, T> {
    return defineCombinator(source => {
        return new class LabeledParser extends BaseParjsParser {
            expecting = source.expecting;
            type = "label";


            _apply(ps: ParsingState): void {
                source.apply(ps);
            }

        }();
    });
}
