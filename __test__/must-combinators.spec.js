"use strict";
/**
 * Created by lifeg on 12/12/2016.
 */
var custom_matchers_1 = require("./custom-matchers");
var parsers_1 = require("../src/bindings/parsers");
var result_1 = require("../src/abstract/basics/result");
var goodInput = "abcd";
var badInput = "";
var uState = {};
var loudParser = parsers_1.Parjs.stringLen(4);
function forParser(parser, f) {
    describe("Parjs." + parser.displayName, function () {
        f(parser);
    });
}
describe("must combinators", function () {
    describe("must combinator", function () {
        var parser = parsers_1.Parjs.stringLen(3).must(function (s) { return s === "abc"; }, "must be 'abc'", result_1.ResultKind.FatalFail);
        it("fails softly if original fails softly", function () {
            custom_matchers_1.verifyFailure(parser.parse("a"), result_1.ResultKind.SoftFail);
        });
        it("succeeds if original succeeds and matches condition", function () {
            custom_matchers_1.verifySuccess(parser.parse("abc"), "abc");
        });
        it("fails accordingly if it doesn't match the condition", function () {
            custom_matchers_1.verifyFailure(parser.parse("abd"), result_1.ResultKind.FatalFail);
        });
    });
    describe("mustCapture combinator", function () {
        var parser = parsers_1.Parjs.string("a").then(parsers_1.Parjs.string("b")).str.or(parsers_1.Parjs.eof.result("")).mustCapture(result_1.ResultKind.FatalFail);
        it("succeeds if it captures", function () {
            custom_matchers_1.verifySuccess(parser.parse("ab"), "ab");
        });
        it("fails softly if original fails softly", function () {
            custom_matchers_1.verifyFailure(parser.parse("ba"), result_1.ResultKind.SoftFail);
        });
        it("fails hard if original fails hard", function () {
            custom_matchers_1.verifyFailure(parser.parse("ax"), result_1.ResultKind.HardFail);
        });
        it("fails accordingly if it succeeds but doesn't capture", function () {
            custom_matchers_1.verifyFailure(parser.parse(""), result_1.ResultKind.FatalFail);
        });
    });
    describe("mustBeNonEmpty combinator", function () {
        var emptyString = parsers_1.Parjs.result("");
        var emptyArray = parsers_1.Parjs.result([]);
        var zeroResult = parsers_1.Parjs.result(0);
        var emptyUndefined = parsers_1.Parjs.result(undefined);
        var emptyNull = parsers_1.Parjs.result(null);
        var fail = parsers_1.Parjs.fail("", result_1.ResultKind.FatalFail);
        it("fails for empty string", function () {
            custom_matchers_1.verifyFailure(emptyString.mustBeNonEmpty.parse(""), result_1.ResultKind.HardFail);
        });
        it("fails for empty array", function () {
            custom_matchers_1.verifyFailure(emptyArray.mustBeNonEmpty.parse(""), result_1.ResultKind.HardFail);
        });
        it("succeeds for 0 result", function () {
            custom_matchers_1.verifySuccess(zeroResult.mustBeNonEmpty.parse(""), 0);
        });
        it("fails for undefined", function () {
            custom_matchers_1.verifyFailure(emptyUndefined.mustBeNonEmpty.parse(""), result_1.ResultKind.HardFail);
        });
        it("fails for null", function () {
            custom_matchers_1.verifyFailure(emptyNull.mustBeNonEmpty.parse(""), result_1.ResultKind.HardFail);
        });
        it("fails for fail", function () {
            custom_matchers_1.verifyFailure(fail.mustBeNonEmpty.parse(""), result_1.ResultKind.FatalFail);
        });
    });
});
//# sourceMappingURL=must-combinators.spec.js.map