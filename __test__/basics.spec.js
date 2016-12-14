"use strict";
var parsers_1 = require("../src/bindings/parsers");
var result_1 = require("../src/abstract/basics/result");
var custom_matchers_1 = require("./custom-matchers");
describe("basics: anyChar example", function () {
    var parser = parsers_1.Parjs.anyChar;
    var successInput = "a";
    var tooMuchInput = "ab";
    var failInput = "";
    var uniqueState = {};
    it("single char input success", function () {
        var result = parser.parse(successInput, uniqueState);
    });
    it("empty input failure", function () {
        var result = parser.parse(failInput, uniqueState);
        custom_matchers_1.verifyFailure(result, result_1.ResultKind.SoftFail, uniqueState);
    });
    it("fails on too much input", function () {
        var result = parser.parse(tooMuchInput, uniqueState);
        custom_matchers_1.verifyFailure(result, result_1.ResultKind.SoftFail, uniqueState);
    });
    describe("non-string inputs", function () {
        it("throws on null, undefined", function () {
            expect(function () { return parser.parse(null); }).toThrow();
            expect(function () { return parser.parse(undefined); }).toThrow();
        });
        it("throws on non-string", function () {
            expect(function () { return parser.parse(5); }).toThrow();
        });
    });
});
//# sourceMappingURL=basics.spec.js.map