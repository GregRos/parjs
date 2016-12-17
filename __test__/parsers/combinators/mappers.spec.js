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
function forParser(parser, f) {
    describe("Parjs." + parser.displayName, function () {
        f(parser);
    });
}
describe("map combinators", function () {
    forParser(loudParser.map(function (x) { return 1; }), function (parser) {
        it("maps on success", function () {
            custom_matchers_1.verifySuccess(parser.parse(goodInput, uState), 1, uState);
        });
        it("fails on failure", function () {
            custom_matchers_1.verifyFailure(parser.parse(badInput, uState), result_1.ResultKind.SoftFail, uState);
        });
    });
    forParser(loudParser.result(1), function (parser) {
        it("maps on success", function () {
            custom_matchers_1.verifySuccess(parser.parse(goodInput, uState), 1);
        });
        it("fails on failure", function () {
            custom_matchers_1.verifyFailure(parser.parse(badInput, uState));
        });
    });
    forParser(loudParser.cast(), function (parser) {
        it("maps on success", function () {
            custom_matchers_1.verifySuccess(parser.parse(goodInput), "abcd");
        });
        it("fails on failure", function () {
            custom_matchers_1.verifyFailure(parser.parse(badInput));
        });
    });
    forParser(loudParser.quiet, function (parser) {
        it("is quiet", function () {
            expect(parser.isLoud).toBe(false);
        });
        it("maps to undefined on success", function () {
            custom_matchers_1.verifySuccess(parser.parse(goodInput), undefined);
        });
        it("fails on failure", function () {
            custom_matchers_1.verifyFailure(parser.parse(badInput));
        });
        it("does not support loud combinators, like .map", function () {
            expect(function () { return parser.map(function (x) { return 1; }); }).toThrow();
        });
    });
});
//# sourceMappingURL=mappers.spec.js.map