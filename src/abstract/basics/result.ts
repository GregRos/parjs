/**
 * Created by lifeg on 24/11/2016.
 */
import _ = require('lodash');
import {ParsingFailureError} from "../../base/parsing-failure";

export class SuccessResult<T> {
    kind = ResultKind.OK;
    constructor(public value : T){

    }

    resolve() : T {
        return this.value;
    }
}

export interface Trace {
    state : object;
    position : number;
    expecting : string;
}

export class FailResult {
    constructor(public kind : FailResultKind, public trace : Trace) {

    }
    resolve() : never {
        throw new ParsingFailureError(this);
    }
}

export type ParserResult<T> = (SuccessResult<T> | FailResult)

export type QuietParserResult = ParserResult<void>;

/**
 *
 */

export module ResultKind {
    export type Unknown = "Unknown";
    export type OK = "OK";
    export type SoftFail = "SoftFail";
    export type HardFail = "HardFail";
    export type FatalFail = "FatalFail";

    export const Unknown : Unknown = "Unknown";
    export const OK : OK = "OK";
    export const SoftFail : SoftFail = "SoftFail";
    export const HardFail : HardFail = "HardFail";
    export const FatalFail : FatalFail = "FatalFail";
}

export type ResultKind = ResultKind.OK | ResultKind.HardFail | ResultKind.FatalFail | ResultKind.SoftFail | ResultKind.Unknown;


export type FailResultKind = ResultKind.HardFail | ResultKind.FatalFail | ResultKind.SoftFail;
