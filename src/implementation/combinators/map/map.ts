import {ParjsParserAction} from "../../../base/action";
import {quietReturn, Issues} from "../../common";
/**
 * Created by User on 21-Nov-16.
 */
export class MapParser extends ParjsParserAction {
    displayName = "map";
    isLoud = true;
    expecting : string;
    constructor(private inner : ParjsParserAction, private map : (x : any) => any) {
        super();
        Issues.quietParserNotPermitted(this);
        this.expecting = inner.expecting;
    }

    _apply(ps : ParsingState) {
        let {inner, map} = this;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.value = map(ps.value);
    }
}



