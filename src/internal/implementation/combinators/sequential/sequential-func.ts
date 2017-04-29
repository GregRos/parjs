/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {Issues} from "../../issues";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {AnyParserAction} from "../../../action";
import {LoudParser} from "../../../../loud";
import {AnyParser} from "../../../../any";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsSeqFunc extends ParjsAction {
    isLoud = true;

    expecting : string;
    constructor(private initial : AnyParserAction,
                private selector : (result : any) => AnyParser,
                private cache ?: Map<any, AnyParser>){
        super();
        this.expecting = initial.expecting;
    }

    _apply(ps : ParsingState) {
        let {initial, selector, cache} = this;
        let results = [];
        initial.apply(ps);
        if (!ps.isOk) {
            //propagate the failure of 'initial' upwards.
            return;
        }
        let next : AnyParser;
        let initialResult = ps.value;
        if (cache) {
            next = cache.get(initialResult);
        }
        if (!next) {
            next = selector(initialResult);
        }
        if (!next) {
            ps.kind = ReplyKind.HardFail;
            ps.expecting = "failed to determine the right parser for the input";
            return;
        }
        if (cache) {
            cache.set(initialResult, next);
        }
        next.action.apply(ps);
        if (ps.isSoft) {
            ps.kind = ReplyKind.HardFail;
        }
    }
}
