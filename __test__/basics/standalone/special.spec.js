"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var result_1 = require("../../../dist/abstract/basics/result");
var custom_matchers_1 = require("../../custom-matchers");
var parsers_1 = require("../../../dist/bindings/parsers");
/**
 * Created by lifeg on 16/12/2016.
 */
function forParser(parser, f) {
    describe("Parjs." + parser.displayName, function () {
        f(parser);
    });
}
describe("special parsers", function () {
    describe("Parjs.eof", function () {
        var parser = parsers_1.Parjs.eof;
        var fail = "a";
        var success = "";
        it("success on empty input", function () {
            custom_matchers_1.expectSuccess(parser.parse(success), undefined);
        });
        it("fail on non-empty input", function () {
            custom_matchers_1.expectFailure(parser.parse(fail), result_1.ResultKind.SoftFail);
        });
        it("chain multiple EOF succeeds", function () {
            var parser2 = parser.then(parsers_1.Parjs.eof);
            custom_matchers_1.expectSuccess(parser2.parse(""), undefined);
        });
    });
    describe("Parjs.state", function () {
        var parser = parsers_1.Parjs.state;
        var uState = {};
        var someInput = "abcd";
        var noInput = "";
        it("succeeds on empty input", function () {
            var result = parser.parse(noInput, uState);
            custom_matchers_1.expectSuccess(result, uState);
        });
        it("fails on non-empty input", function () {
            var result = parser.parse(someInput, uState);
            custom_matchers_1.expectFailure(result);
        });
    });
    describe("Parjs.position", function () {
        var parser = parsers_1.Parjs.position;
        var noInput = "";
        it("succeeds on empty input", function () {
            var result = parser.parse(noInput);
            custom_matchers_1.expectSuccess(result, 0);
        });
        it("fails on non-empty input", function () {
            var result = parser.parse("abc");
            custom_matchers_1.expectFailure(result);
        });
    });
    describe("Parjs.result(x)", function () {
        var parser = parsers_1.Parjs.result("x");
        var noInput = "";
        it("succeeds on empty input", function () {
            custom_matchers_1.expectSuccess(parser.parse(noInput), "x");
        });
        it("fails on non-empty input", function () {
            custom_matchers_1.expectFailure(parser.parse("a"));
        });
    });
    describe("Parjs.fail", function () {
        var parser = parsers_1.Parjs.fail("error", "FatalFail");
        var noInput = "";
        var input = "abc";
        it("fails on no input", function () {
            custom_matchers_1.expectFailure(parser.parse(noInput), result_1.ResultKind.FatalFail);
        });
        it("fails on non-empty input", function () {
            custom_matchers_1.expectFailure(parser.parse(input), result_1.ResultKind.FatalFail);
        });
    });
});
//# sourceMappingURL=special.spec.js.map