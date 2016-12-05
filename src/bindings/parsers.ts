import {ParjsParser} from "./combinators";
import {PrsCharWhere, PrsResult, PrsEof, PrsFail, PrsNewline, PrsString, PrsStringLen, PrsRest, AnyStringOf, PrsRegexp, PrsPosition, PrsState } from '../implementation/parsers';
import {ParjsParserAction} from "../base/action";
import {Chars} from "../functions/char-indicators";
/**
 * Created by lifeg on 24/11/2016.
 */

function wrap(action : ParjsParserAction) {
    return new ParjsParser(action);
}

export class ParjsParsers implements CharParsers, StringParsers, PrimitiveParsers, SpecialParsers {
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
        return this.charWhere(Chars.isUnicodeInlineSpace)
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

    get fail() {
        return wrap(new PrsFail());
    }

    get position() {
        return wrap (new PrsPosition())
    }

    get state() {
        return wrap(new PrsState());
    }

}

export const Parjs = new ParjsParsers();