import {JaseParserAction} from "../../../base/parser-action";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsWithState extends JaseParserAction{
    isLoud : boolean;
    displayName = "withState";
    constructor (private inner : AnyParserAction, private reducer : (state : any, result : any) => any) {
        super();
        this.isLoud = inner.isLoud;
    }

    _apply(ps : ParsingState) {
        let {inner, reducer} = this;
        inner.apply(ps);
        if (!ps.result.isOk) {
            return;
        }
        ps.state = reducer(ps.state, ps.value);
    }
}