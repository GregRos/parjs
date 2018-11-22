/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ParsingState} from "../../state";

/**
 * Created by lifeg on 24/03/2017.
 */
export class PrsLate extends ParjsAction {
    displayName = "late (unbound)";
    expecting: string;
    private _resolved: AnyParserAction;

    constructor(private _resolver: () => AnyParserAction, public isLoud: boolean) {
        super();
    };

    _apply(ps: ParsingState) {
        if (!this._resolved) {
            this._resolved = this._resolver();
            this.expecting = this._resolved.expecting;
        }
        this._resolved.apply(ps);
    }
}