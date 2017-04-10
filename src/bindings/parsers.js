"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instance_combinators_1 = require("./instance-combinators");
const parsers_1 = require("../implementation/parsers");
const combinators_1 = require("../implementation/combinators");
const char_indicators_1 = require("../functions/char-indicators");
const result_1 = require("../abstract/basics/result");
const int_1 = require("../implementation/parsers/numbers/int");
const float_1 = require("../implementation/parsers/numbers/float");
const _ = require("lodash");
const late_1 = require("../implementation/combinators/special/late");
/**
 * Created by lifeg on 24/11/2016.
 */
function wrap(action) {
    return new instance_combinators_1.ParjsParser(action);
}
class ParjsParsers {
    get spaces1() {
        return this.space.many(1).str.withName("spaces1");
    }
    late(resolver) {
        return wrap(new late_1.PrsLate(() => resolver().action, true)).withName("late");
    }
    get asciiLetter() {
        return this.charWhere(char_indicators_1.Chars.isAsciiLetter).withName("asciiLetter");
    }
    any(...parsers) {
        return wrap(new combinators_1.PrsAlts(parsers.map(x => x.action))).withName("any");
    }
    seq(...parsers) {
        return wrap(new combinators_1.PrsSeq(parsers.map(x => x.action))).withName("seq");
    }
    get anyChar() {
        return wrap(new parsers_1.PrsStringLen(1)).withName("anyChar");
    }
    charWhere(predicate, property) {
        return wrap(new parsers_1.PrsCharWhere(predicate, property)).withName(`charWhere`);
    }
    anyCharOf(options) {
        return this.charWhere(x => options.includes(x), `any of ${options}`).withName("anyCharOf");
    }
    noCharOf(options) {
        return this.charWhere(x => !options.includes(x)).withName("noCharOf");
    }
    get digit() {
        return this.charWhere(char_indicators_1.Chars.isDigit).withName("digit");
    }
    get hex() {
        return this.charWhere(char_indicators_1.Chars.isHex).withName("hex");
    }
    get asciiLower() {
        return this.charWhere(char_indicators_1.Chars.isAsciiLower).withName("asciiLower");
    }
    get asciiUpper() {
        return this.charWhere(char_indicators_1.Chars.isAsciiUpper).withName("asciiUpper");
    }
    get newline() {
        return wrap(new parsers_1.PrsNewline(false)).withName("newline");
    }
    get unicodeNewline() {
        return wrap(new parsers_1.PrsNewline(true)).withName("unicodeNewline");
    }
    get space() {
        return this.charWhere(char_indicators_1.Chars.isInlineSpace).withName("space");
    }
    get unicodeSpace() {
        return this.charWhere(char_indicators_1.Chars.isUnicodeInlineSpace).withName("unicodeSpace");
    }
    get spaces() {
        return this.space.many().str.withName("spaces");
    }
    get unicodeSpaces() {
        return this.unicodeSpace.many().str.withName("unicodeSpaces");
    }
    get nop() {
        return this.result(undefined).q.withName("nop");
    }
    get rest() {
        return wrap(new parsers_1.PrsRest()).withName("rest");
    }
    string(str) {
        return wrap(new parsers_1.PrsString(str)).withName("string");
    }
    anyStringOf(...strs) {
        return wrap(new parsers_1.AnyStringOf(strs)).withName("anyStringOf");
    }
    stringLen(length) {
        return wrap(new parsers_1.PrsStringLen(length)).withName("stringLen");
    }
    regexp(regex) {
        return wrap(new parsers_1.PrsRegexp(regex)).withName("regexp");
    }
    result(x) {
        return wrap(new parsers_1.PrsResult(x)).withName("result");
    }
    get eof() {
        return wrap(new parsers_1.PrsEof()).withName("eof");
    }
    fail(expecting = "", kind = result_1.ReplyKind.SoftFail) {
        return wrap(new parsers_1.PrsFail(kind, expecting)).withName("fail");
    }
    get position() {
        return wrap(new parsers_1.PrsPosition()).withName("position");
    }
    get state() {
        return wrap(new parsers_1.PrsState()).withName("state");
    }
    int(options) {
        options = _.defaults({}, options, {
            base: 10,
            allowSign: true
        });
        return wrap(new int_1.PrsInt(options)).withName("int");
    }
    float(options) {
        options = _.defaults({}, options, {
            allowImplicitZero: true,
            allowExponent: true,
            allowSign: true,
            allowFloatingPoint: true
        });
        return wrap(new float_1.PrsFloat(options)).withName("float");
    }
}
exports.Parjs = new ParjsParsers();
//# sourceMappingURL=parsers.js.map