import {ParjsAction} from "../../../base/action";
import {Issues} from "../../common";
import {ParsingState} from "../../../abstract/basics/state";
import {ResultKind} from "../../../abstract/basics/result";
import {AnyParserAction} from "../../../abstract/basics/action";
import {LoudParser} from "../../../abstract/combinators/loud";
import {AnyParser} from "../../../abstract/combinators/any";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsSeqFunc extends ParjsAction {
    isLoud = true;
    displayName = "seqFunc";
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
            ps.kind = ResultKind.HardFail;
            ps.expecting = "failed to determine the right parser for the input";
            return;
        }
        if (cache) {
            cache.set(initialResult, next);
        }
        next.action.apply(ps);
        if (ps.isSoft) {
            ps.kind = ResultKind.HardFail;
        }
    }
}
