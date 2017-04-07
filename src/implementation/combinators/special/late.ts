import {ParjsAction} from "../../../base/action";
import {AnyParserAction} from "../../../abstract/basics/action";
import {ParsingState} from "../../../abstract/basics/state";
/**
 * Created by lifeg on 24/03/2017.
 */
export class PrsLate extends ParjsAction {
    displayName = "late (unbound)";
    expecting: string;
    private _resolved : AnyParserAction;
    constructor(private _resolver: () => AnyParserAction, public isLoud : boolean) {
        super();
    };

    _apply(ps : ParsingState) {
        if (!this._resolved) {
            this._resolved = this._resolver();
            this.expecting = this._resolved.expecting;
            this.displayName = `late ${this._resolved.displayName}`;
        }
        this._resolved.apply(ps);
    }
}