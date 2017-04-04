"use strict";
/**
 * Created by lifeg on 12/12/2016.
 */
const custom_matchers_1 = require("../../custom-matchers");
const parsers_1 = require("../../../dist/bindings/parsers");
const result_1 = require("../../../dist/abstract/basics/result");
describe("must combinators", () => {
    describe("must combinator", () => {
        let parser = parsers_1.Parjs.stringLen(3).must(s => s === "abc", "must be 'abc'", result_1.ResultKind.FatalFail);
        it("fails softly if original fails softly", () => {
            custom_matchers_1.expectFailure(parser.parse("a"), result_1.ResultKind.SoftFail);
        });
        it("succeeds if original succeeds and matches condition", () => {
            custom_matchers_1.expectSuccess(parser.parse("abc"), "abc");
        });
        it("fails accordingly if it doesn't match the condition", () => {
            custom_matchers_1.expectFailure(parser.parse("abd"), result_1.ResultKind.FatalFail);
        });
    });
    it("mustBeOf", () => {
        let parser = parsers_1.Parjs.stringLen(3).mustBeOf("a", "b", "c");
        it("succeeds when is of", () => {
            custom_matchers_1.expectSuccess(parser.parse("b"), "b");
        });
        it("fails when is not of", () => {
            custom_matchers_1.expectFailure(parser.parse("d"), "SoftFail");
        });
    });
    it("mustBeOf", () => {
        let parser = parsers_1.Parjs.stringLen(3).mustNotBeOf("a", "b", "c");
        it("fails when is of", () => {
            custom_matchers_1.expectFailure(parser.parse("b"), "SoftFail");
        });
        it("succeeds when is not of", () => {
            custom_matchers_1.expectSuccess(parser.parse("d"), "d");
        });
    });
    describe("mustCapture combinator", () => {
        let parser = parsers_1.Parjs.string("a").then(parsers_1.Parjs.string("b")).str.or(parsers_1.Parjs.eof.result("")).mustCapture(result_1.ResultKind.FatalFail);
        it("succeeds if it captures", () => {
            custom_matchers_1.expectSuccess(parser.parse("ab"), "ab");
        });
        it("fails softly if original fails softly", () => {
            custom_matchers_1.expectFailure(parser.parse("ba"), result_1.ResultKind.SoftFail);
        });
        it("fails hard if original fails hard", () => {
            custom_matchers_1.expectFailure(parser.parse("ax"), result_1.ResultKind.HardFail);
        });
        it("fails accordingly if it succeeds but doesn't capture", () => {
            custom_matchers_1.expectFailure(parser.parse(""), result_1.ResultKind.FatalFail);
        });
    });
    describe("mustBeNonEmpty combinator", () => {
        let emptyString = parsers_1.Parjs.result("");
        let emptyArray = parsers_1.Parjs.result([]);
        let zeroResult = parsers_1.Parjs.result(0);
        let emptyUndefined = parsers_1.Parjs.result(undefined);
        let emptyNull = parsers_1.Parjs.result(null);
        let fail = parsers_1.Parjs.fail("", result_1.ResultKind.FatalFail);
        let emptyObj = parsers_1.Parjs.result({});
        it("fails for empty string", () => {
            custom_matchers_1.expectFailure(emptyString.mustBeNonEmpty.parse(""), result_1.ResultKind.HardFail);
        });
        it("fails for empty array", () => {
            custom_matchers_1.expectFailure(emptyArray.mustBeNonEmpty.parse(""), result_1.ResultKind.HardFail);
        });
        it("succeeds for 0 result", () => {
            custom_matchers_1.expectSuccess(zeroResult.mustBeNonEmpty.parse(""), 0);
        });
        it("fails for undefined", () => {
            custom_matchers_1.expectFailure(emptyUndefined.mustBeNonEmpty.parse(""), result_1.ResultKind.HardFail);
        });
        it("fails for null", () => {
            custom_matchers_1.expectFailure(emptyNull.mustBeNonEmpty.parse(""), result_1.ResultKind.HardFail);
        });
        it("fails for fail", () => {
            custom_matchers_1.expectFailure(fail.mustBeNonEmpty.parse(""), result_1.ResultKind.FatalFail);
        });
        it("fails for empty object", () => {
            custom_matchers_1.expectFailure(emptyObj.mustBeNonEmpty.parse(""), result_1.ResultKind.HardFail);
        });
    });
});
//# sourceMappingURL=must.spec.js.map