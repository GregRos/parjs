"use strict";
var parsers_1 = require("../src/bindings/parsers");
var custom_matchers_1 = require("./custom-matchers");
var result_1 = require("../src/abstract/basics/result");
/**
 * Created by User on 14-Dec-16.
 */
describe("numeric parsers", function () {
    describe("int parser", function () {
        var parser = parsers_1.Parjs.int({
            base: 10,
            allowSign: true
        });
        describe("default settings", function () {
            it("fails for empty input", function () {
                custom_matchers_1.verifyFailure(parser.parse(""), result_1.ResultKind.SoftFail);
            });
            it("fails for bad digits", function () {
                custom_matchers_1.verifyFailure(parser.parse("a"), result_1.ResultKind.SoftFail);
            });
            it("succeeds for sequence of with sign digits", function () {
                custom_matchers_1.verifySuccess(parser.parse("-22"), 22);
            });
            it("succeeds for sequence of digits without sign", function () {
                custom_matchers_1.verifySuccess(parser.parse("22"), 22);
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
        });
    });
});
//# sourceMappingURL=numeric-parsers.spec.js.map