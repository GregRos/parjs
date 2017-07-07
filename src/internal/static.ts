/**
 * @module parjs/internal
 */ /** */
import {ParjsParser} from "./instance";
import {PrsCharWhere, PrsResult, PrsEof, PrsFail, PrsNewline, PrsString, PrsStringLen, PrsRest, AnyStringOf, PrsRegexp, PrsPosition, PrsState } from './implementation/parsers';
import {PrsAlts, PrsSeq, PrsLate} from './implementation/combinators';
import {ParjsAction, ParjsBasicAction} from "./implementation/action";
import {AnyParser} from "../any";
import {ReplyKind} from "../reply";
import {IntOptions, PrsInt} from "./implementation/parsers/numbers/int";
import {FloatOptions, PrsFloat} from "./implementation/parsers/numbers/float";
import _defaults = require('lodash/defaults');
import {LoudParser, ParjsProjection} from "../loud";
import {ParjsStatic, ParjsStaticHelper} from "../parjs";
import {AnyParserAction} from "./action";
import {BasicTraceVisualizer} from "./implementation/basic-trace-visualizer";
import {AsciiCodeInfo, AsciiCharInfo} from "./implementation/functions/char-indicators";
//IMPORTANT: Importing only interfaces from char-info makes sure that no require statement is actually emitted.
//If we were to import anything else, we'd create a real dependency on char-info that add a lot of weight when Parjs is bundled.
import {StaticCodeInfo, StaticCharInfo} from "char-info";

function wrap(action : ParjsAction) {
	return new ParjsParser(action);
}

class NoUnicodeError extends Error {
	constructor() {
		super("The optional Unicode character recognizers haven't been loaded. Please load them by importing/requiring 'parjs/unicode'");
	}
}

export const InfoContainer = new class InfoContainer {
	private _codeInfo : StaticCodeInfo = null;
	private _charInfo : StaticCharInfo = null;
	set CodeInfo(info) {
		this._codeInfo = this._codeInfo || info;
	}

	set CharInfo(info) {
		this._charInfo = this._charInfo || info;
	}
	
	get CodeInfo() {
		if (!this._codeInfo) {
			throw new NoUnicodeError();
		}
		return this._codeInfo
	}

	get CharInfo() {
		if (!this._charInfo) {
			throw new NoUnicodeError();
		}
		return this._charInfo;
	}
};

export let CodeInfo : StaticCodeInfo;
export let CharInfo : StaticCharInfo;

export class ParjsHelper implements ParjsStaticHelper{
    isParser(obj : any) : obj is AnyParser {
        return obj instanceof ParjsParser;
    }

    isParserAction(obj : any) : obj is AnyParserAction {
        return obj instanceof ParjsBasicAction;
    }
}

export class ParjsParsers implements ParjsStatic {
    helper = new ParjsHelper();
    visualizer = new BasicTraceVisualizer();
    get spaces1() {
        return this.space.many(1).str.withName("spaces1");
    }

    late<T>(resolver : () => LoudParser<T>) : LoudParser<T> {
        return wrap(new PrsLate(() => resolver().action, true)).withName("late");
    }

    get letter() {
        return this.charWhere(AsciiCharInfo.isLetter).withName("letter")
    }

    any(...parsers : AnyParser[]) {
        return wrap(new PrsAlts(parsers.map(x => x.action))).withName("any");
    }

    seq(...parsers : AnyParser[]) {
        return wrap(new PrsSeq(parsers.map(x => x.action))).withName("seq");
    }

    get anyChar() {
        return wrap(new PrsStringLen(1)).withName("anyChar");
    }

    charWhere(predicate : ParjsProjection<string, boolean>, property ?: string) {
        return wrap(new PrsCharWhere(predicate, property)).withName(`charWhere`);
    }

    anyCharOf(options : string) {
        return this.charWhere(x => options.includes(x), `any of ${options}`).withName("anyCharOf");
    }

    noCharOf(options : string) {
        return this.charWhere(x => !options.includes(x)).withName("noCharOf");
    }


    get uniLetter() {
        return this.charWhere(InfoContainer.CharInfo.isUniLetter).withName("uniLetter");
    }

    get digit() {
        return this.charWhere(AsciiCharInfo.isDecimal).withName("digit");
    }

    get uniDigit() {
        return this.charWhere(InfoContainer.CharInfo.isUniDecimal).withName("uniDigit");
    }

    get hex() {
        return this.charWhere(AsciiCharInfo.isHex).withName("hex");
    }

    get uniLower() {
        return this.charWhere(InfoContainer.CharInfo.isUniLower).withName("uniLower");
    }

    get lower() {
        return this.charWhere(AsciiCharInfo.isLower).withName("lower");
    }

    get upper() {
        return this.charWhere(AsciiCharInfo.isUpper).withName("upper");
    }

    get uniUpper() {
        return this.charWhere(InfoContainer.CharInfo.isUniUpper).withName("uniUpper");
    }

    get newline() {
        return wrap(new PrsNewline(null)).withName("newline");
    }

    get uniNewline() {
        return wrap(new PrsNewline(InfoContainer.CodeInfo)).withName("uniNewline");
    }

    get space() {
        return this.charWhere(AsciiCharInfo.isSpace).withName("space");
    }

    get uniSpace() {
        return this.charWhere(InfoContainer.CharInfo.isUniSpace).withName("uniSpace");
    }

    get whitespaces() {
        return this.charWhere(c => AsciiCharInfo.isSpace(c) || AsciiCharInfo.isNewline(c)).many().str.withName("whitespaces");
    }

    get uniSpaces() {
        return this.uniSpace.many().str.withName("uniSpaces");
    }

    get nop() {
        return this.result(undefined).q.withName("nop");
    }

    get rest() {
        return wrap(new PrsRest()).withName("rest");
    }

    string(str : string) {
        return wrap(new PrsString(str)).withName("string");
    }

    anyStringOf(...strs : string[]){
        return wrap(new AnyStringOf(strs)).withName("anyStringOf");
    }

    stringLen(length : number) {
        return wrap(new PrsStringLen(length)).withName("stringLen");
    }

    regexp(regex : RegExp) {
        return wrap(new PrsRegexp(regex)).withName("regexp");
    }

    result(x : any) {
        return wrap(new PrsResult(x)).withName("result");
    }

    get eof() {
        return wrap(new PrsEof()).withName("eof");
    }

    fail(expecting = "", kind : ReplyKind.Fail = ReplyKind.SoftFail) {
        return wrap(new PrsFail(kind, expecting)).withName("fail");
    }

    get position() {
        return wrap (new PrsPosition()).withName("position");
    }

    get state() {
        return wrap(new PrsState()).withName("state");
    }

    int(options ?: IntOptions) {
        options = _defaults({}, options, {
            base: 10,
            allowSign : true
        });
        return wrap(new PrsInt(options)).withName("int");
    }

    float(options ?: FloatOptions) {
        options = _defaults({}, options, {
            allowImplicitZero : true,
            allowExponent : true,
            allowSign : true,
            allowFloatingPoint : true
        } as FloatOptions);

        return wrap(new PrsFloat(options)).withName("float");
    }
}