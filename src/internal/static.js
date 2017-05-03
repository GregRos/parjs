"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal
 */ /** */
const instance_1 = require("./instance");
const parsers_1 = require("./implementation/parsers");
const combinators_1 = require("./implementation/combinators");
const action_1 = require("./implementation/action");
const reply_1 = require("../reply");
const int_1 = require("./implementation/parsers/numbers/int");
const float_1 = require("./implementation/parsers/numbers/float");
const _ = require("lodash");
const basic_trace_visualizer_1 = require("./implementation/basic-trace-visualizer");
const char_info_1 = require("char-info");
function wrap(action) {
    return new instance_1.ParjsParser(action);
}
class ParjsHelper {
    isParser(obj) {
        return obj instanceof instance_1.ParjsParser;
    }
    isParserAction(obj) {
        return obj instanceof action_1.ParjsBasicAction;
    }
}
exports.ParjsHelper = ParjsHelper;
class ParjsParsers {
    constructor() {
        this.helper = new ParjsHelper();
        this.visualizer = new basic_trace_visualizer_1.BasicTraceVisualizer();
    }
    get spaces1() {
        return this.space.many(1).str.withName("spaces1");
    }
    late(resolver) {
        return wrap(new combinators_1.PrsLate(() => resolver().action, true)).withName("late");
    }
    get asciiLetter() {
        return this.charWhere(char_info_1.CharInfo.isLetter).withName("asciiLetter");
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
    get letter() {
        return this.charWhere(char_info_1.CharInfo.isLetter).withName("letter");
    }
    get uniLetter() {
        return this.charWhere(char_info_1.CharInfo.isUniLetter).withName("uniLetter");
    }
    get digit() {
        return this.charWhere(char_info_1.CharInfo.isDecimal).withName("digit");
    }
    get uniDigit() {
        return this.charWhere(char_info_1.CharInfo.isUniDecimal).withName("uniDigit");
    }
    get hex() {
        return this.charWhere(char_info_1.CharInfo.isHex).withName("hex");
    }
    get uniLower() {
        return this.charWhere(char_info_1.CharInfo.isUniLower).withName("uniLower");
    }
    get lower() {
        return this.charWhere(char_info_1.CharInfo.isLower).withName("lower");
    }
    get upper() {
        return this.charWhere(char_info_1.CharInfo.isUpper).withName("upper");
    }
    get uniUpper() {
        return this.charWhere(char_info_1.CharInfo.isUniUpper).withName("uniUpper");
    }
    get newline() {
        return wrap(new parsers_1.PrsNewline(false)).withName("newline");
    }
    get uniNewline() {
        return wrap(new parsers_1.PrsNewline(true)).withName("uniNewline");
    }
    get space() {
        return this.charWhere(char_info_1.CharInfo.isSpace).withName("space");
    }
    get uniSpace() {
        return this.charWhere(char_info_1.CharInfo.isUniSpace).withName("uniSpace");
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
    fail(expecting = "", kind = reply_1.ReplyKind.SoftFail) {
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
exports.ParjsParsers = ParjsParsers;
//# sourceMappingURL=static.js.map