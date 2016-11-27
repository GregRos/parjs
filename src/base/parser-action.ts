import {failReturn} from "../implementation/common";
/**
 * Created by lifeg on 23/11/2016.
 */
export abstract class JaseParserAction {
    protected abstract _apply(ps : ParsingState) : boolean;

    abstract displayName : string;
    apply(ps : ParsingState) : boolean {
        let {position, state} = ps;
        if (this._apply(ps)) {
            return true;
        } else {
            ps.position = position;
            ps.state = state;
            ps.result = failReturn;
        }
    }
    abstract isLoud : boolean;
}

export abstract class JaseBaseParserAction extends JaseParserAction {
    isLoud = true;
}