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
import {CodeInfo, CharInfo} from "char-info";
function wrap(action : ParjsAction) {
        return new ParjsParser(action);
}

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

    get asciiLetter() {
        return this.charWhere(CharInfo.isLetter).withName("asciiLetter")
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

    get letter() {
        return this.charWhere(CharInfo.isLetter).withName("letter");
    }

    get uniLetter() {
        return this.charWhere(CharInfo.isUniLetter).withName("uniLetter");
    }

    get digit() {
        return this.charWhere(CharInfo.isDecimal).withName("digit");
    }

    get uniDigit() {
        return this.charWhere(CharInfo.isUniDecimal).withName("uniDigit");
    }

    get hex() {
        return this.charWhere(CharInfo.isHex).withName("hex");
    }

    get uniLower() {
        return this.charWhere(CharInfo.isUniLower).withName("uniLower");
    }

    get lower() {
        return this.charWhere(CharInfo.isLower).withName("lower");
    }

    get upper() {
        return this.charWhere(CharInfo.isUpper).withName("upper");
    }

    get uniUpper() {
        return this.charWhere(CharInfo.isUniUpper).withName("uniUpper");
    }

    get newline() {
        return wrap(new PrsNewline(false)).withName("newline");
    }

    get uniNewline() {
        return wrap(new PrsNewline(true)).withName("uniNewline");
    }

    get space() {
        return this.charWhere(CharInfo.isSpace).withName("space");
    }

    get uniSpace() {
        return this.charWhere(CharInfo.isUniSpace).withName("uniSpace");
    }

    get spaces() {
        return this.space.many().str.withName("spaces");
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