"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by lifeg on 10/12/2016.
 */
var custom_matchers_1 = require("../../custom-matchers");
var parsers_1 = require("../../../dist/bindings/parsers");
var result_1 = require("../../../dist/abstract/basics/result");
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
        var parser = loudParser.q;
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
    describe("str", function () {
        it("quiet", function () {
            var p = parsers_1.Parjs.eof.str;
            custom_matchers_1.expectSuccess(p.parse(""), "");
        });
        it("null", function () {
            var p = parsers_1.Parjs.result(null).str;
            custom_matchers_1.expectSuccess(p.parse(""), "null");
        });
        it("undefined", function () {
            var p = parsers_1.Parjs.result(undefined).str;
            custom_matchers_1.expectSuccess(p.parse(""), "undefined");
        });
        it("string", function () {
            var p = parsers_1.Parjs.string("a").str;
            custom_matchers_1.expectSuccess(p.parse("a"), "a");
        });
        it("symbol", function () {
            var p = parsers_1.Parjs.result(Symbol("hi")).str;
            custom_matchers_1.expectSuccess(p.parse(""), "hi");
        });
        it("object", function () {
            var p = parsers_1.Parjs.result({}).str;
            custom_matchers_1.expectSuccess(p.parse(""), {}.toString());
        });
    });
});
//# sourceMappingURL=mappers.spec.js.map