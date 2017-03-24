"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var custom_matchers_1 = require("../../custom-matchers");
var parsers_1 = require("../../../dist/bindings/parsers");
var goodInput = "abcd";
describe("special combinators", function () {
    describe("backtrack", function () {
        var parser = parsers_1.Parjs.string("hi").then(parsers_1.Parjs.eof).backtrack;
        it("fails soft if inner fails soft", function () {
            custom_matchers_1.expectFailure(parser.parse("x"), "SoftFail");
        });
        it("fails hard if inner fails hard", function () {
            custom_matchers_1.expectFailure(parser.parse("hiAQ"), "HardFail");
        });
        it("succeeds if inner succeeds, non-zero match", function () {
            var parseHi = parsers_1.Parjs.string("hi");
            var redundantParser = parseHi.backtrack.then(parsers_1.Parjs.string("his"));
            custom_matchers_1.expectSuccess(redundantParser.parse("his"), ["hi", "his"]);
        });
    });
    describe("withState", function () {
        var parser = parsers_1.Parjs.string("hi").then(parsers_1.Parjs.string("hi")).str.withState(function (s) { return 12; });
        it("fails soft if inner fails soft", function () {
            custom_matchers_1.expectFailure(parser.parse("a"), "SoftFail");
        });
        it("fails hard if inner fails hard", function () {
            custom_matchers_1.expectFailure(parser.parse("hi"), "HardFail");
        });
        it("succeeds if inner succeeds, changes state", function () {
            custom_matchers_1.expectSuccess(parser.parse("hihi"), "hihi", 12);
        });
        var parser2 = parser.then(parsers_1.Parjs.eof);
        it("chains state correctly", function () {
            custom_matchers_1.expectSuccess(parser.parse("hihi"), "hihi", 12);
        });
        it("two state changes", function () {
            var parser3 = parser2.withState(function () { return "abc"; });
            custom_matchers_1.expectSuccess(parser3.parse("hihi"), "hihi", "abc");
        });
        it("value overload", function () {
            var parser3 = parser2.withState("def");
            custom_matchers_1.expectSuccess(parser3.parse("hihi"), "hihi", "def");
        });
    });
});
//# sourceMappingURL=special.spec.js.map