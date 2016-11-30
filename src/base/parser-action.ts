import {failReturn} from "../implementation/common";


class BasicParsingResult implements ParsingResult {
    message : any;
    constructor(public kind : ResultKind, public value : any = undefined) {

    }
    get isOk() {
        return this.kind === ResultKind.OK;
    }

    get isSoft() {
        return this.kind === ResultKind.SoftFail;
    }

    get isHard() {
        return this.kind === ResultKind.HardFail;
    }

    get isFatal() {
        return this.kind === ResultKind.FatalFail;
    }
}

export class ResultsClass {

}

export class BasicParsingState implements ParsingState {
    position = 0;
    state = undefined;
    value = undefined;
    result = undefined;
    constructor(public readonly input : string) {

    }

}

/**
 * Created by lifeg on 23/11/2016.
 */
export abstract class JaseParserAction {
    protected abstract _apply(ps : ParsingState) : void;

    abstract displayName : string;
    apply(ps : ParsingState) : void {
        let {position, state} = ps;
        this._apply(ps);
        if (!ps.result.isOk) {
            ps.value = failReturn;
        }
    }
    abstract isLoud : boolean;
}

export abstract class JaseBaseParserAction extends JaseParserAction {
    isLoud = true;
}