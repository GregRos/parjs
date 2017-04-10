"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parsers_1 = require("../../../dist/bindings/parsers");
const custom_matchers_1 = require("../../custom-matchers");
const result_1 = require("../../../dist/abstract/basics/result");
/**
 * Created by User on 14-Dec-16.
 */
describe("numeric parsers", () => {
    describe("int parser", () => {
        describe("default settings", () => {
            let parser = parsers_1.Parjs.int({
                base: 10,
                allowSign: true
            });
            it("fails for empty input", () => {
                custom_matchers_1.expectFailure(parser.parse(""), result_1.ReplyKind.SoftFail);
            });
            it("fails for bad digits", () => {
                custom_matchers_1.expectFailure(parser.parse("a"), result_1.ReplyKind.SoftFail);
            });
            it("succeeds for sequence of with sign digits", () => {
                custom_matchers_1.expectSuccess(parser.parse("-24"), -24);
            });
            it("succeeds for sequence of digits without sign", () => {
                custom_matchers_1.expectSuccess(parser.parse("24"), 24);
            });
            it("fails for extra letters", () => {
                custom_matchers_1.expectFailure(parser.parse("22a"), result_1.ReplyKind.SoftFail);
            });
            it("chains into rest", () => {
                custom_matchers_1.expectSuccess(parser.then(parsers_1.Parjs.rest.q).parse("22a"), 22);
            });
            it("fails hard if there are no digits after sign", () => {
                custom_matchers_1.expectFailure(parser.parse("+a"), result_1.ReplyKind.HardFail);
            });
        });
        describe("no sign", () => {
            let parser = parsers_1.Parjs.int({
                base: 16,
                allowSign: false
            });
            it("fails for sign start", () => {
                custom_matchers_1.expectFailure(parser.parse("-f"), result_1.ReplyKind.SoftFail);
            });
            it("succeeds without sign, higher base", () => {
                custom_matchers_1.expectSuccess(parser.parse("f"), 15);
            });
        });
    });
    describe("float parser", () => {
        describe("default settings", () => {
            let parser = parsers_1.Parjs.float();
            it("regular float", () => {
                custom_matchers_1.expectSuccess(parser.parse("0.11"), 0.11);
            });
            it("integer", () => {
                custom_matchers_1.expectSuccess(parser.parse("15"), 15);
            });
            it("float without whole part", () => {
                custom_matchers_1.expectSuccess(parser.parse(".1"), .1);
            });
            it("float without fractional part", () => {
                custom_matchers_1.expectSuccess(parser.parse("1."), 1.);
            });
            it("integer with positive exponent", () => {
                custom_matchers_1.expectSuccess(parser.parse("52e+12"), 52e+12);
            });
            it("float with negative exponent", () => {
                custom_matchers_1.expectSuccess(parser.parse("5.1e-2"), 5.1e-2);
            });
            it("float without whole part and exponent", () => {
                custom_matchers_1.expectSuccess(parser.parse(".5e+5"), .5e+5);
            });
            it("float without fractional and exponent", () => {
                custom_matchers_1.expectSuccess(parser.parse("5.e+2"), 5.e+2);
            });
            it("integer with negative exponent", () => {
                custom_matchers_1.expectSuccess(parser.parse("52e-12"), 52e-12);
            });
            it("fails soft on dot", () => {
                custom_matchers_1.expectFailure(parser.parse("."), result_1.ReplyKind.SoftFail);
            });
            it("fails on empty input", () => {
                custom_matchers_1.expectFailure(parser.parse(""), result_1.ReplyKind.SoftFail);
            });
            it("fails hard on dot after sign", () => {
                custom_matchers_1.expectFailure(parser.parse("+."), result_1.ReplyKind.HardFail);
            });
            it("fails hard on sign and invalid char", () => {
                custom_matchers_1.expectFailure(parser.parse("+a"), result_1.ReplyKind.HardFail);
            });
            it("fails soft on invalid char", () => {
                custom_matchers_1.expectFailure(parser.parse("a"), result_1.ReplyKind.SoftFail);
            });
            it("fails hard on invalid exponent after sign", () => {
                custom_matchers_1.expectFailure(parser.parse("1.0e+a"), result_1.ReplyKind.HardFail);
            });
            it("fails hard on exponent without sign", () => {
                custom_matchers_1.expectFailure(parser.parse("1.0e+"), result_1.ReplyKind.HardFail);
            });
            it("fails softly for just exponent", () => {
                custom_matchers_1.expectFailure(parser.parse("e+12"), result_1.ReplyKind.SoftFail);
            });
            it("fails when E appears without exponent", () => {
                custom_matchers_1.expectFailure(parser.parse("1.0e"), "HardFail");
            });
        });
        describe("no sign", () => {
            let parser = parsers_1.Parjs.float({
                allowSign: false
            });
            it("fails on sign", () => {
                custom_matchers_1.expectFailure(parser.parse("+1"), result_1.ReplyKind.SoftFail);
            });
            it("succeeds on exp without sign", () => {
                custom_matchers_1.expectSuccess(parser.parse("1.0e-12"), 1.0e-12);
            });
        });
        describe("no implicit zero", () => {
            let parser = parsers_1.Parjs.float({
                allowImplicitZero: false
            });
            it("fails on implicit zero whole", () => {
                custom_matchers_1.expectFailure(parser.parse(".1"), result_1.ReplyKind.SoftFail);
            });
            it("fails hard on sign and then no implicit zero", () => {
                custom_matchers_1.expectFailure(parser.parse("+.1"), "HardFail");
            });
            it("succeeds on implicit zero fraction when chained into rest", () => {
                custom_matchers_1.expectSuccess(parser.then(parsers_1.Parjs.rest.q).parse("1."), 1);
            });
            it("succeeds on regular", () => {
                custom_matchers_1.expectSuccess(parser.parse("1.0"), 1.0);
            });
            it("succeeds on exponent", () => {
                custom_matchers_1.expectSuccess(parser.parse("1.0e+2"), 1.0e+2);
            });
        });
        describe("no decimal point", () => {
            let parser = parsers_1.Parjs.float({
                allowFloatingPoint: false
            });
            it("succeeds on integer", () => {
                custom_matchers_1.expectSuccess(parser.parse("123"), 123);
            });
            it("fails on floating point due to excess input", () => {
                custom_matchers_1.expectFailure(parser.parse("1.0"), result_1.ReplyKind.SoftFail);
            });
            it("succeeds on floating point with chained rest", () => {
                custom_matchers_1.expectSuccess(parser.then(parsers_1.Parjs.rest.q).parse("1.5"), 1);
            });
            it("succeeds on exponent integer", () => {
                custom_matchers_1.expectSuccess(parser.parse("23e+2"), 23e+2);
            });
        });
        describe("no exponent", () => {
            let parser = parsers_1.Parjs.float({
                allowExponent: false
            });
            it("succeeds on floating point", () => {
                custom_matchers_1.expectSuccess(parser.parse("23.12"), 23.12);
            });
            it("succeeds on exponent with trailing rest", () => {
                custom_matchers_1.expectSuccess(parser.then(parsers_1.Parjs.rest.q).parse("12e+2", { x: 12 }));
            });
        });
    });
});
//# sourceMappingURL=numeric.spec.js.map