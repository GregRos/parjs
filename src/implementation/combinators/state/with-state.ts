import {ParjsAction} from "../../../base/action";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsWithState extends ParjsAction{
    isLoud : boolean;
    displayName = "withState";
    expecting : string;
    constructor (private inner : AnyParserAction, private reducer : (state : any, result : any) => any) {
        super();
        this.isLoud = inner.isLoud;
        this.expecting = inner.expecting;
    }

    _apply(ps : ParsingState) {
        let {inner, reducer} = this;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.state = reducer(ps.state, ps.value);
    }
}