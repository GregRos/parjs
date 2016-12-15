"use strict";
var parsers_1 = require("../src/bindings/parsers");
var custom_matchers_1 = require("./custom-matchers");
var result_1 = require("../src/abstract/basics/result");
/**
 * Created by User on 14-Dec-16.
 */
describe("numeric parsers", function () {
    describe("int parser", function () {
        describe("default settings", function () {
            var parser = parsers_1.Parjs.int({
                base: 10,
                allowSign: true
            });
            it("fails for empty input", function () {
                custom_matchers_1.verifyFailure(parser.parse(""), result_1.ResultKind.SoftFail);
            });
            it("fails for bad digits", function () {
                custom_matchers_1.verifyFailure(parser.parse("a"), result_1.ResultKind.SoftFail);
            });
            it("succeeds for sequence of with sign digits", function () {
                custom_matchers_1.verifySuccess(parser.parse("-24"), -24);
            });
            it("succeeds for sequence of digits without sign", function () {
                custom_matchers_1.verifySuccess(parser.parse("24"), 24);
            });
            it("fails for extra letters", function () {
                custom_matchers_1.verifyFailure(parser.parse("22a"), result_1.ResultKind.SoftFail);
            });
            it("chains into rest", function () {
                custom_matchers_1.verifySuccess(parser.then(parsers_1.Parjs.rest.quiet).parse("22a"), 22);
            });
            it("fails hard if there are no digits after sign", function () {
                custom_matchers_1.verifyFailure(parser.parse("+a"), result_1.ResultKind.HardFail);
            });
        });
        describe("no sign", function () {
            var parser = parsers_1.Parjs.int({
                base: 16,
                allowSign: false
            });
            it("fails for sign start", function () {
                custom_matchers_1.verifyFailure(parser.parse("-f"), result_1.ResultKind.SoftFail);
            });
            it("succeeds without sign, higher base", function () {
                custom_matchers_1.verifySuccess(parser.parse("f"), 15);
            });
        });
    });
    describe("float parser", function () {
        describe("default settings", function () {
            var parser = parsers_1.Parjs.float();
            it("regular float", function () {
                custom_matchers_1.verifySuccess(parser.parse("0.11"), 0.11);
            });
            it("integer", function () {
                custom_matchers_1.verifySuccess(parser.parse("15"), 15);
            });
            it("float without whole part", function () {
                custom_matchers_1.verifySuccess(parser.parse(".1"), .1);
            });
            it("float without fractional part", function () {
                custom_matchers_1.verifySuccess(parser.parse("1."), 1.);
            });
            it("integer with positive exponent", function () {
                custom_matchers_1.verifySuccess(parser.parse("52e+12"), 52e+12);
            });
            it("float with negative exponent", function () {
                custom_matchers_1.verifySuccess(parser.parse("5.1e-2"), 5.1e-2);
            });
            it("float without whole part and exponent", function () {
                custom_matchers_1.verifySuccess(parser.parse(".5e+5"), .5e+5);
            });
            it("float without fractional and exponent", function () {
                custom_matchers_1.verifySuccess(parser.parse("5.e+2"), 5.e+2);
            });
            it("integer with negative exponent", function () {
                custom_matchers_1.verifySuccess(parser.parse("52e-12"), 52e-12);
            });
            it("fails soft on dot", function () {
                custom_matchers_1.verifyFailure(parser.parse("."), result_1.ResultKind.SoftFail);
            });
            it("fails hard on dot after sign", function () {
                custom_matchers_1.verifyFailure(parser.parse("+."), result_1.ResultKind.HardFail);
            });
            it("fails hard on sign and invalid char", function () {
                custom_matchers_1.verifyFailure(parser.parse("+a"), result_1.ResultKind.HardFail);
            });
            it("fails soft on invalid char", function () {
                custom_matchers_1.verifyFailure(parser.parse("a"), result_1.ResultKind.SoftFail);
            });
            it("fails hard on invalid exponent after sign", function () {
                custom_matchers_1.verifyFailure(parser.parse("1.0e+a"), result_1.ResultKind.HardFail);
            });
            it("fails hard on exponent without sign", function () {
                custom_matchers_1.verifyFailure(parser.parse("1.0e+"), result_1.ResultKind.HardFail);
            });
            it("fails softly for just exponent", function () {
                custom_matchers_1.verifyFailure(parser.parse("e+12"), result_1.ResultKind.SoftFail);
            });
        });
        describe("no sign", function () {
            var parser = parsers_1.Parjs.float({
                allowSign: false
            });
            it("fails on sign", function () {
                custom_matchers_1.verifyFailure(parser.parse("+1"), result_1.ResultKind.SoftFail);
            });
            it("succeeds on exp without sign", function () {
                custom_matchers_1.verifySuccess(parser.parse("1.0e-12"), 1.0e-12);
            });
        });
        describe("no implicit zero", function () {
            var parser = parsers_1.Parjs.float({
                allowImplicitZero: false
            });
            it("fails on implicit zero whole", function () {
                custom_matchers_1.verifyFailure(parser.parse(".1"), result_1.ResultKind.SoftFail);
            });
            it("succeeds on implicit zero fraction when chained into rest", function () {
                custom_matchers_1.verifySuccess(parser.then(parsers_1.Parjs.rest.quiet).parse("1."), 1);
            });
            it("succeeds on regular", function () {
                custom_matchers_1.verifySuccess(parser.parse("1.0"), 1.0);
            });
            it("succeeds on exponent", function () {
                custom_matchers_1.verifySuccess(parser.parse("1.0e+2"), 1.0e+2);
            });
        });
        describe("no decimal point", function () {
            var parser = parsers_1.Parjs.float({
                allowFloatingPoint: false
            });
            it("succeeds on integer", function () {
                custom_matchers_1.verifySuccess(parser.parse("123"), 123);
            });
            it("fails on floating point due to excess input", function () {
                custom_matchers_1.verifyFailure(parser.parse("1.0"), result_1.ResultKind.SoftFail);
            });
            it("succeeds on floating point with chained rest", function () {
                custom_matchers_1.verifySuccess(parser.then(parsers_1.Parjs.rest.quiet).parse("1.5"), 1);
            });
            it("succeeds on exponent integer", function () {
                custom_matchers_1.verifySuccess(parser.parse("23e+2"), 23e+2);
            });
        });
        describe("no exponent", function () {
            var parser = parsers_1.Parjs.float({
                allowExponent: false
            });
            it("succeeds on floating point", function () {
                custom_matchers_1.verifySuccess(parser.parse("23.12"), 23.12);
            });
            it("succeeds on exponent with trailing rest", function () {
                custom_matchers_1.verifySuccess(parser.then(parsers_1.Parjs.rest.quiet).parse("12e+2", 12));
            });
        });
    });
});
//# sourceMappingURL=numeric-parsers.spec.js.map