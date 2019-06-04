/**
 * @module parjs/internal/implementation/combinators
 */
/** */
import {ParjsAction} from "../../action";
import {AnyParserAction} from "../../../action";
import {ReplyKind} from "../../../../reply";
import {ParsingState} from "../../state";

/**
 * Created by User on 22-Nov-16.
 */
export class PrsInverse extends ParjsAction {

    isLoud = false;
    expecting: string;

    constructor(private _inner: AnyParserAction) {
        super();
        this.expecting = `not: ${_inner.expecting}`;
    }

    _apply(ps: ParsingState) {
        let {_inner} = this;
        let {position} = ps;
        _inner.apply(ps);
        if (ps.isOk) {
            ps.position = position;
            ps.kind = ReplyKind.SoftFail;
        } else if (ps.kind === ReplyKind.HardFail || ps.kind === ReplyKind.SoftFail) {
            //hard fails are okay here
            ps.kind = ReplyKind.Ok;
            ps.position = position;
            return;
        }
        //the remaining case is a fatal failure that isn't recovered from.
    }
}