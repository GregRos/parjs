"use strict";
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
describe("or combinator", function () {
    it("guards against loud-quiet parser mixing", function () {
        expect(function () { return parsers_1.Parjs.any(parsers_1.Parjs.digit, parsers_1.Parjs.digit.quiet); });
    });
    describe("loud or loud", function () {
        var parser = parsers_1.Parjs.string("ab").or(parsers_1.Parjs.string("cd"));
        it("succeeds parsing 1st option", function () {
            custom_matchers_1.verifySuccess(parser.parse("ab"), "ab");
        });
        it("suceeds parsing 2nd option", function () {
            custom_matchers_1.verifySuccess(parser.parse("cd"), "cd");
        });
        it("fails parsing both", function () {
            custom_matchers_1.verifyFailure(parser.parse("ef"), result_1.ResultKind.SoftFail);
        });
        it("fails hard when 1st fails hard", function () {
            var parser2 = parsers_1.Parjs.fail("fail", result_1.ResultKind.HardFail).result("x").or(parsers_1.Parjs.string("ab"));
            custom_matchers_1.verifyFailure(parser2.parse("ab"), result_1.ResultKind.HardFail);
        });
        var parser2 = parsers_1.Parjs.string("ab").or(parsers_1.Parjs.fail("x", result_1.ResultKind.HardFail));
        it("succeeds with 2nd would've failed hard", function () {
            custom_matchers_1.verifySuccess(parser2.parse("ab"), "ab");
        });
        it("fails when 2nd fails hard", function () {
            custom_matchers_1.verifyFailure(parser2.parse("cd"), result_1.ResultKind.HardFail);
        });
    });
});
//# sourceMappingURL=or-combinators.spec.js.map