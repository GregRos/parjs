"use strict";
/**
 * Created by lifeg on 09/12/2016.
 */
var custom_matchers_1 = require("../../custom-matchers");
var parsers_1 = require("../../../src/bindings/parsers");
var result_1 = require("../../../src/abstract/basics/result");
var uState = {};
describe("basic string parsers", function () {
    describe("Parjs.anyChar", function () {
        var parser = parsers_1.Parjs.anyChar;
        var successInput = "a";
        var failInput = "";
        var tooLongInput = "ab";
        it("succeeds on single char", function () {
            custom_matchers_1.expectSuccess(parser.parse(successInput, uState), successInput, uState);
        });
        it("fails on empty input", function () {
            custom_matchers_1.expectFailure(parser.parse(failInput, uState), result_1.ResultKind.SoftFail, uState);
        });
        it("fails on too long input", function () {
            custom_matchers_1.expectFailure(parser.parse(tooLongInput, uState), result_1.ResultKind.SoftFail, uState);
        });
    });
    describe("Parjs.anyCharOf[abcd]", function () {
        var parser = parsers_1.Parjs.anyCharOf("abcd");
        var success = "c";
        var fail = "1";
        it("succeeds on single char from success", function () {
            custom_matchers_1.expectSuccess(parser.parse(success), success);
        });
        it("fails on invalid single char", function () {
            custom_matchers_1.expectFailure(parser.parse(fail), result_1.ResultKind.SoftFail);
        });
        it("fails on too long input", function () {
            custom_matchers_1.expectFailure(parser.parse("ab"), result_1.ResultKind.SoftFail);
        });
    });
    describe("Parjs.noCharOf[abcd]", function () {
        var parser = parsers_1.Parjs.noCharOf("abcd");
        var success = "1";
        var fail = "a";
        it("success on single char not from list", function () {
            custom_matchers_1.expectSuccess(parser.parse(success), success);
        });
        it("fails on single char from list", function () {
            custom_matchers_1.expectFailure(parser.parse(fail), result_1.ResultKind.SoftFail);
        });
        it("fails on too long input", function () {
            custom_matchers_1.expectFailure(parser.parse("12"), result_1.ResultKind.SoftFail);
        });
    });
    describe("Parjs.string(hi)", function () {
        var parser = parsers_1.Parjs.string("hi");
        var success = "hi";
        var fail = "bo";
        it("success", function () {
            custom_matchers_1.expectSuccess(parser.parse(success), success);
        });
        it("fail", function () {
            custom_matchers_1.expectFailure(parser.parse(fail), result_1.ResultKind.SoftFail);
        });
        it("fail too long", function () {
            custom_matchers_1.expectFailure(parser.parse(success + "1"), result_1.ResultKind.SoftFail);
        });
    });
    describe("Parjs.anyStringOf(hi, hello)", function () {
        var parser = parsers_1.Parjs.anyStringOf("hi", "hello");
        var success1 = "hello";
        var success2 = "hi";
        var fail = "bo";
        it("success1", function () {
            custom_matchers_1.expectSuccess(parser.parse(success1), success1);
        });
        it("success2", function () {
            custom_matchers_1.expectSuccess(parser.parse(success2), success2);
        });
        it("fail", function () {
            custom_matchers_1.expectFailure(parser.parse(fail), result_1.ResultKind.SoftFail);
        });
        it("fail too long", function () {
            custom_matchers_1.expectFailure(parser.parse(success2 + "1"), result_1.ResultKind.SoftFail);
        });
    });
    describe("Parjs.newline", function () {
        var parser = parsers_1.Parjs.newline;
        var unix = "\n";
        var winNewline = "\r\n";
        var macNewline = "\r";
        var badInput = "a";
        var empty = "";
        var tooLong1 = "\r\n1";
        var tooLong2 = "\n\r";
        var allNewlines = "\r\r\n\n\u0085\u0028\u2029";
        it("success unix newline", function () {
            custom_matchers_1.expectSuccess(parser.parse(unix), unix);
        });
        it("success windows newline", function () {
            custom_matchers_1.expectSuccess(parser.parse(winNewline), winNewline);
        });
        it("success on mac newline", function () {
            custom_matchers_1.expectSuccess(parser.parse(macNewline), macNewline);
        });
        it("success on all newline string, incl unicode newline", function () {
            var unicodeNewline = parsers_1.Parjs.unicodeNewline.many();
            var result = unicodeNewline.parse(allNewlines);
            expect(result.kind).toBe(result_1.ResultKind.OK);
            if (result.kind !== result_1.ResultKind.OK)
                return;
            expect(result.value.length).toBe(allNewlines.length - 1);
        });
        it("fails on empty", function () {
            custom_matchers_1.expectFailure(parser.parse(empty));
        });
        it("fails on bad", function () {
            custom_matchers_1.expectFailure(parser.parse(badInput));
        });
        it("fails on too long 1", function () {
            custom_matchers_1.expectFailure(parser.parse(tooLong1));
        });
        it("fails on too long 2", function () {
            custom_matchers_1.expectFailure(parser.parse(tooLong2));
        });
    });
    describe("Parjs.rest", function () {
        var parser = parsers_1.Parjs.rest;
        var nonEmpty = "abcd";
        var empty = "";
        it("success on non-empty let input", function () {
            custom_matchers_1.expectSuccess(parser.parse(nonEmpty));
        });
        it("success on empty input", function () {
            custom_matchers_1.expectSuccess(parser.parse(empty));
        });
    });
    describe("Parjs.stringLen(3)", function () {
        var parser = parsers_1.Parjs.stringLen(3);
        var shortInput = "a";
        var goodInput = "abc";
        var longInput = "abcd";
        it("fails on too short input", function () {
            custom_matchers_1.expectFailure(parser.parse(shortInput));
        });
        it("succeeds on good input", function () {
            custom_matchers_1.expectSuccess(parser.parse(goodInput), goodInput);
        });
        it("fails on long input", function () {
            custom_matchers_1.expectFailure(parser.parse(longInput));
        });
    });
});
//# sourceMappingURL=string.spec.js.map