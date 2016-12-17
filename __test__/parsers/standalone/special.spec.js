"use strict";
var result_1 = require("../../../src/abstract/basics/result");
var custom_matchers_1 = require("../../custom-matchers");
var parsers_1 = require("../../../src/bindings/parsers");
/**
 * Created by lifeg on 16/12/2016.
 */
function forParser(parser, f) {
    describe("Parjs." + parser.displayName, function () {
        f(parser);
    });
}
describe("special parsers", function () {
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
});
//# sourceMappingURL=special.spec.js.map