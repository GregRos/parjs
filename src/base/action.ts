import {failReturn, quietReturn} from "../implementation/common";


class BasicParsingResult implements ParsingResult {
    message : any;
    constructor(public kind : ResultKind, public value : any = undefined) {

    }

}

export class ResultsClass {

}

export class BasicParsingState implements ParsingState {
    position = 0;
    state = undefined;
    value = undefined;
    result : ResultKind;
    expecting : string;
    constructor(public input : string) {

    }

    get isOk() {
        return this.result === ResultKind.OK;
    }

    get isSoft() {
        return this.result === ResultKind.SoftFail;
    }

    get isHard() {
        return this.result === ResultKind.HardFail;
    }

    get isFatal() {
        return this.result === ResultKind.FatalFail;
    }
}

/**
 * Created by lifeg on 23/11/2016.
 */
export abstract class ParjsParserAction {
    protected abstract _apply(ps : ParsingState) : void | number;
    abstract expecting : string;
    abstract displayName : string;
    apply(ps : ParsingState) : void {
        let {position, state} = ps;
        ps.result = ResultKind.Uninitialized;
        this._apply(ps);

        if (!ps.isOk) {
            ps.value = failReturn;
            ps.expecting = ps.expecting || this.expecting;
        } else if (!this.isLoud) {
            ps.value = quietReturn;
        }
    }
    abstract isLoud : boolean;
}

export abstract class ParjsBaseParserAction extends ParjsParserAction {
    isLoud = true;
}