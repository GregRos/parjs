import {ParjsParser} from "./instance-combinators";
import {PrsCharWhere, PrsResult, PrsEof, PrsFail, PrsNewline, PrsString, PrsStringLen, PrsRest, AnyStringOf, PrsRegexp, PrsPosition, PrsState } from '../implementation/parsers';
import {PrsAlts, PrsSeq} from '../implementation/combinators';
import {ParjsAction} from "../base/action";
import {Chars} from "../functions/char-indicators";
import {CharParsers} from "../abstract/parsers/char";
import {StringParsers} from "../abstract/parsers/string";
import {PrimitiveParsers} from "../abstract/parsers/primitives";
import {SpecialParsers} from "../abstract/parsers/special";
import {StaticCombinators} from "../abstract/combinators/static";
import {AnyParser} from "../abstract/combinators/any";
import {ResultKind, FailIndicator, toResultKind} from "../abstract/basics/result";
import {IntOptions, PrsInt} from "../implementation/parsers/numbers/int";
import {FloatOptions, PrsFloat} from "../implementation/parsers/numbers/float";
import {NumericParsers} from "../abstract/parsers/numeric";
import {assert} from 'chai';
import _ = require('lodash');
import {Issues} from "../implementation/common";
import {PrsLate} from "../implementation/combinators/special/late";
/**
 * Created by lifeg on 24/11/2016.
 */

function wrap(action : ParjsAction) {
    return new ParjsParser(action);
}

function changeName(parser : ParjsParser, altName : string) {
    (parser as {displayName : string}).displayName = altName;
}

export class ParjsParsers implements CharParsers, NumericParsers, StringParsers, PrimitiveParsers, SpecialParsers, StaticCombinators {

    get spaces1() {
        return this.space.many(1);
    }

    late(resolver : () => AnyParser) {
        return wrap(new PrsLate(() => resolver().action));
    }

    char(theChar : string) {
        if (theChar.length !== 1) {
            throw Issues.stringWrongLength({displayName : "char"}, "1");
        }
        return this.anyCharOf(theChar)
    }

    get asciiLetter() {
        return this.charWhere(Chars.isAsciiLetter);
    }


    any(...parsers : AnyParser[]) {
        return wrap(new PrsAlts(parsers.map(x => x.action)));
    }

    seq(...parsers : AnyParser[]) {
        return wrap(new PrsSeq(parsers.map(x => x.action)));
    }

    get anyChar() {
        return wrap(new PrsStringLen(1));
    }

    charWhere(predicate : (char : string) => boolean) {
        return wrap(new PrsCharWhere(predicate));
    }

    anyCharOf(options : string) {
        return this.charWhere(x => options.includes(x));
    }

    noCharOf(options : string) {
        return this.charWhere(x => !options.includes(x));
    }

    get digit() {
        return this.charWhere(Chars.isDigit);
    }

    get hex() {
        return this.charWhere(Chars.isHex);
    }

    get upper() {
        return this.charWhere(Chars.isUpper);
    }

    get lower() {
        return this.charWhere(Chars.isLower);
    }

    get letter() {
        return this.charWhere(x => Chars.isLower(x) || Chars.isUpper(x))
    }

    get asciiLower() {
        return this.charWhere(Chars.isAsciiLower);
    }

    get asciiUpper() {
        return this.charWhere(Chars.isAsciiUpper);
    }

    get newline() {
        return wrap(new PrsNewline(false));
    }

    get unicodeNewline() {
        return wrap(new PrsNewline(true));
    }

    get space() {
        return this.charWhere(Chars.isInlineSpace);
    }

    get unicodeSpace() {
        return this.charWhere(Chars.isUnicodeInlineSpace);
    }

    get spaces() {
        return this.space.many().str;
    }

    get unicodeSpaces() {
        return this.unicodeSpaces.many().str;
    }

    get rest() {
        return wrap(new PrsRest());
    }

    string(str : string) {
        return wrap(new PrsString(str));
    }

    anyStringOf(...strs : string[]){
        return wrap(new AnyStringOf(strs));
    }

    stringLen(length : number) {
        return wrap(new PrsStringLen(length));
    }

    regexp(regex : RegExp) {
        return wrap(new PrsRegexp(regex));
    }

    result(x : any) {
        return wrap(new PrsResult(x));
    }

    get eof() {
        return wrap(new PrsEof());
    }

    fail(expecting = "", kind : FailIndicator = ResultKind.SoftFail) {
        return wrap(new PrsFail(toResultKind(kind), expecting));
    }

    get position() {
        return wrap (new PrsPosition())
    }

    get state() {
        return wrap(new PrsState());
    }

    int(options ?: IntOptions) {
        options = _.defaults({}, options, {
            base: 10,
            allowSign : true
        });
        return wrap(new PrsInt(options));
    }

    float(options ?: FloatOptions) {
        options = _.defaults({}, options, {
            allowImplicitZero : true,
            allowExponent : true,
            allowSign : true,
            allowFloatingPoint : true
        } as FloatOptions);

        return wrap(new PrsFloat(options));
    }
}

export const Parjs = new ParjsParsers() as CharParsers & NumericParsers & StringParsers & PrimitiveParsers & SpecialParsers & StaticCombinators;