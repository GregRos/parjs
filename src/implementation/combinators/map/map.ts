import {ParjsAction} from "../../../base/action";
import {QUIET_RESULT, Issues} from "../../common";
import {ParsingState} from "../../../abstract/basics/state";
/**
 * Created by User on 21-Nov-16.
 */
export class MapParser extends ParjsAction {
    displayName = "map";
    isLoud = true;
    expecting : string;
    constructor(private inner : ParjsAction, private map : (x : any, y : any) => any) {
        super();
        this.expecting = inner.expecting;
    }

    _apply(ps : ParsingState) {
        let {inner, map} = this;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.value = map(ps.value, ps.state);
    }
}



