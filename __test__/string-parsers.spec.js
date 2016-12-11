"use strict";
/**
 * Created by lifeg on 09/12/2016.
 */
var custom_matchers_1 = require('./custom-matchers');
var parsers_1 = require("../src/bindings/parsers");
var result_1 = require("../src/abstract/basics/result");
var uState = {};
function forParser(parser, f) {
    describe("Parjs." + parser.displayName, function () {
        f(parser);
    });
}
describe("basic string parsers", function () {
    forParser(parsers_1.Parjs.anyChar, function (parser) {
        var successInput = "a";
        var failInput = "";
        var tooLongInput = "ab";
        it("succeeds on single char", function () {
            custom_matchers_1.verifySuccess(parser.parse(successInput, uState), successInput, uState);
        });
        it("fails on empty input", function () {
            custom_matchers_1.verifyFailure(parser.parse(failInput, uState), result_1.ResultKind.SoftFail, uState);
        });
        it("fails on too long input", function () {
            custom_matchers_1.verifyFailure(parser.parse(tooLongInput, uState), result_1.ResultKind.SoftFail, uState);
        });
    });
    forParser(parsers_1.Parjs.anyCharOf("abcd"), function (parser) {
        var success = "c";
        var fail = "1";
        it("succeeds on single char from success", function () {
            custom_matchers_1.verifySuccess(parser.parse(success), success);
        });
        it("fails on invalid single char", function () {
            custom_matchers_1.verifyFailure(parser.parse(fail), result_1.ResultKind.SoftFail);
        });
        it("fails on too long input", function () {
            custom_matchers_1.verifyFailure(parser.parse("ab"), result_1.ResultKind.SoftFail);
        });
    });
    forParser(parsers_1.Parjs.noCharOf("abcd"), function (parser) {
        var success = "1";
        var fail = "a";
        it("success on single char not from list", function () {
            custom_matchers_1.verifySuccess(parser.parse(success), success);
        });
        it("fails on single char from list", function () {
            custom_matchers_1.verifyFailure(parser.parse(fail), result_1.ResultKind.SoftFail);
        });
        it("fails on too long input", function () {
            custom_matchers_1.verifyFailure(parser.parse("12"), result_1.ResultKind.SoftFail);
        });
    });
    forParser(parsers_1.Parjs.eof, function (parser) {
        var fail = "a";
        var success = "";
        it("success on empty input", function () {
            custom_matchers_1.verifySuccess(parser.parse(success), undefined);
        });
        it("fail on non-empty input", function () {
            custom_matchers_1.verifyFailure(parser.parse(fail), result_1.ResultKind.SoftFail);
        });
    });
    forParser(parsers_1.Parjs.string("hi"), function (parser) {
        var success = "hi";
        var fail = "bo";
        it("success", function () {
            custom_matchers_1.verifySuccess(parser.parse(success), success);
        });
        it("fail", function () {
            custom_matchers_1.verifyFailure(parser.parse(fail), result_1.ResultKind.SoftFail);
        });
        it("fail too long", function () {
            custom_matchers_1.verifyFailure(parser.parse(success + "1"), result_1.ResultKind.SoftFail);
        });
    });
    forParser(parsers_1.Parjs.anyStringOf("hi", "hello"), function (parser) {
        var success1 = "hello";
        var success2 = "hi";
        var fail = "bo";
        it("success1", function () {
            custom_matchers_1.verifySuccess(parser.parse(success1), success1);
        });
        it("success2", function () {
            custom_matchers_1.verifySuccess(parser.parse(success2), success2);
        });
        it("fail", function () {
            custom_matchers_1.verifyFailure(parser.parse(fail), result_1.ResultKind.SoftFail);
        });
        it("fail too long", function () {
            custom_matchers_1.verifyFailure(parser.parse(success2 + "1"), result_1.ResultKind.SoftFail);
        });
    });
    forParser(parsers_1.Parjs.newline, function (parser) {
        var unix = "\n";
        var winNewline = "\r\n";
        var badInput = "a";
        var empty = "";
        var tooLong1 = "\r\n1";
        var tooLong2 = "\n\r";
        it("success unix newline", function () {
            custom_matchers_1.verifySuccess(parser.parse(unix), unix);
        });
        it("success windows newline", function () {
            custom_matchers_1.verifySuccess(parser.parse(winNewline), winNewline);
        });
        it("fails on empty", function () {
            custom_matchers_1.verifyFailure(parser.parse(empty));
        });
        it("fails on bad", function () {
            custom_matchers_1.verifyFailure(parser.parse(badInput));
        });
        it("fails on too long 1", function () {
            custom_matchers_1.verifyFailure(parser.parse(tooLong1));
        });
        it("fails on too long 2", function () {
            custom_matchers_1.verifyFailure(parser.parse(tooLong2));
        });
    });
    forParser(parsers_1.Parjs.rest, function (parser) {
        var nonEmpty = "abcd";
        var empty = "";
        it("success on non-empty let input", function () {
            custom_matchers_1.verifySuccess(parser.parse(nonEmpty));
        });
        it("success on empty input", function () {
            custom_matchers_1.verifySuccess(parser.parse(empty));
        });
    });
    forParser(parsers_1.Parjs.state, function (parser) {
        var uState = {};
        var someInput = "abcd";
        var noInput = "";
        it("succeeds on empty input", function () {
            var result = parser.parse(noInput, uState);
            custom_matchers_1.verifySuccess(result, uState);
        });
        it("fails on non-empty input", function () {
            var result = parser.parse(someInput, uState);
            custom_matchers_1.verifyFailure(result);
        });
    });
    forParser(parsers_1.Parjs.position, function (parser) {
        var noInput = "";
        it("succeeds on empty input", function () {
            var result = parser.parse(noInput);
            custom_matchers_1.verifySuccess(result, 0);
        });
        it("fails on non-empty input", function () {
            var result = parser.parse("abc");
            custom_matchers_1.verifyFailure(result);
        });
    });
    forParser(parsers_1.Parjs.result("x"), function (parser) {
        var noInput = "";
        it("succeeds on empty input", function () {
            custom_matchers_1.verifySuccess(parser.parse(noInput), "x");
        });
        it("fails on non-empty input", function () {
            custom_matchers_1.verifyFailure(parser.parse("a"));
        });
    });
    forParser(parsers_1.Parjs.fail("error", result_1.ResultKind.FatalFail), function (parser) {
        var noInput = "";
        var input = "abc";
        it("fails on no input", function () {
            custom_matchers_1.verifyFailure(parser.parse(noInput), result_1.ResultKind.FatalFail);
        });
        it("fails on non-empty input", function () {
            custom_matchers_1.verifyFailure(parser.parse(input), result_1.ResultKind.FatalFail);
        });
    });
    forParser(parsers_1.Parjs.stringLen(3), function (parser) {
        var shortInput = "a";
        var goodInput = "abc";
        var longInput = "abcd";
        it("fails on too short input", function () {
            custom_matchers_1.verifyFailure(parser.parse(shortInput));
        });
        it("succeeds on good input", function () {
            custom_matchers_1.verifySuccess(parser.parse(goodInput), goodInput);
        });
        it("fails on long input", function () {
            custom_matchers_1.verifyFailure(parser.parse(longInput));
        });
    });
});
//# sourceMappingURL=string-parsers.spec.js.map