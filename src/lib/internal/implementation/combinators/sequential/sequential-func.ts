/**
 * @module parjs/internal/implementation/combinators
 */ /** */
import {ParjsAction} from "../../action";
import {ParsingState} from "../../state";
import {ReplyKind} from "../../../../reply";
import {AnyParserAction} from "../../../action";
import {AnyParser} from "../../../../any";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsSeqFunc extends ParjsAction {
    isLoud = true;

    expecting : string;
    constructor(private _initial : AnyParserAction,
                private _selector : (result : any) => AnyParser,
                private _cache ?: Map<any, AnyParser>){
        super();
        this.expecting = _initial.expecting;
    }

    _apply(ps : ParsingState) {
        let {_initial, _selector, _cache} = this;
        let results = [];
        _initial.apply(ps);
        if (!ps.isOk) {
            //propagate the failure of 'initial' upwards.
            return;
        }
        let next : AnyParser;
        let initialResult = ps.value;
        if (_cache) {
            next = _cache.get(initialResult);
        }
        if (!next) {
            next = _selector(initialResult);
        }
        if (!next) {
            ps.kind = ReplyKind.HardFail;
            ps.expecting = "failed to determine the right parser for the input";
            return;
        }
        if (_cache) {
            _cache.set(initialResult, next);
        }
        next.action.apply(ps);
        if (ps.isSoft) {
            ps.kind = ReplyKind.HardFail;
        }
    }
}
