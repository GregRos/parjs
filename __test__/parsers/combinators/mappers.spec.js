"use strict";
/**
 * Created by lifeg on 10/12/2016.
 */
var custom_matchers_1 = require("../../custom-matchers");
var parsers_1 = require("../../../src/bindings/parsers");
var result_1 = require("../../../src/abstract/basics/result");
var goodInput = "abcd";
var badInput = "";
var uState = {};
var loudParser = parsers_1.Parjs.stringLen(4);
describe("map combinators", function () {
    describe("map", function () {
        var parser = loudParser.map(function (x) { return 1; });
        it("maps on success", function () {
            custom_matchers_1.expectSuccess(parser.parse(goodInput, uState), 1, uState);
        });
        it("fails on failure", function () {
            custom_matchers_1.expectFailure(parser.parse(badInput, uState), result_1.ResultKind.SoftFail, uState);
        });
    });
    describe("Parjs.result(1)", function () {
        var parser = loudParser.result(1);
        it("maps on success", function () {
            custom_matchers_1.expectSuccess(parser.parse(goodInput, uState), 1);
        });
        it("fails on failure", function () {
            custom_matchers_1.expectFailure(parser.parse(badInput, uState));
        });
    });
    describe("cast", function () {
        var parser = loudParser.cast();
        it("maps on success", function () {
            custom_matchers_1.expectSuccess(parser.parse(goodInput), "abcd");
        });
        it("fails on failure", function () {
            custom_matchers_1.expectFailure(parser.parse(badInput));
        });
    });
    describe("quiet", function () {
        var parser = loudParser.quiet;
        it("is quiet", function () {
            expect(parser.isLoud).toBe(false);
        });
        it("maps to undefined on success", function () {
            custom_matchers_1.expectSuccess(parser.parse(goodInput), undefined);
        });
        it("fails on failure", function () {
            custom_matchers_1.expectFailure(parser.parse(badInput));
        });
        it("does not support loud combinators, like .map", function () {
            expect(function () { return parser.map(function (x) { return 1; }); }).toThrow();
        });
    });
});
//# sourceMappingURL=mappers.spec.js.map