"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by lifeg on 12/12/2016.
 */
const custom_matchers_1 = require("../../custom-matchers");
const dist_1 = require("../../../dist");
const reply_1 = require("../../../dist/reply");
describe("must combinators", () => {
    describe("must combinator", () => {
        let parser = dist_1.Parjs.stringLen(3).must(s => s === "abc", "must be 'abc'", reply_1.ReplyKind.FatalFail);
        it("fails softly if original fails softly", () => {
            custom_matchers_1.expectFailure(parser.parse("a"), reply_1.ReplyKind.SoftFail);
        });
        it("succeeds if original succeeds and matches condition", () => {
            custom_matchers_1.expectSuccess(parser.parse("abc"), "abc");
        });
        it("fails accordingly if it doesn't match the condition", () => {
            custom_matchers_1.expectFailure(parser.parse("abd"), reply_1.ReplyKind.FatalFail);
        });
    });
    it("mustBeOf", () => {
        let parser = dist_1.Parjs.stringLen(3).mustBeOf("a", "b", "c");
        it("succeeds when is of", () => {
            custom_matchers_1.expectSuccess(parser.parse("b"), "b");
        });
        it("fails when is not of", () => {
            custom_matchers_1.expectFailure(parser.parse("d"), "SoftFail");
        });
    });
    it("mustBeOf", () => {
        let parser = dist_1.Parjs.stringLen(3).mustNotBeOf("a", "b", "c");
        it("fails when is of", () => {
            custom_matchers_1.expectFailure(parser.parse("b"), "SoftFail");
        });
        it("succeeds when is not of", () => {
            custom_matchers_1.expectSuccess(parser.parse("d"), "d");
        });
    });
    describe("mustCapture combinator", () => {
        let parser = dist_1.Parjs.string("a").then(dist_1.Parjs.string("b")).str.or(dist_1.Parjs.eof.result("")).mustCapture(reply_1.ReplyKind.FatalFail);
        it("succeeds if it captures", () => {
            custom_matchers_1.expectSuccess(parser.parse("ab"), "ab");
        });
        it("fails softly if original fails softly", () => {
            custom_matchers_1.expectFailure(parser.parse("ba"), reply_1.ReplyKind.SoftFail);
        });
        it("fails hard if original fails hard", () => {
            custom_matchers_1.expectFailure(parser.parse("ax"), reply_1.ReplyKind.HardFail);
        });
        it("fails accordingly if it succeeds but doesn't capture", () => {
            custom_matchers_1.expectFailure(parser.parse(""), reply_1.ReplyKind.FatalFail);
        });
    });
    describe("mustBeNonEmpty combinator", () => {
        let emptyString = dist_1.Parjs.result("");
        let emptyArray = dist_1.Parjs.result([]);
        let zeroResult = dist_1.Parjs.result(0);
        let emptyUndefined = dist_1.Parjs.result(undefined);
        let emptyNull = dist_1.Parjs.result(null);
        let fail = dist_1.Parjs.fail("", reply_1.ReplyKind.FatalFail);
        let emptyObj = dist_1.Parjs.result({});
        it("fails for empty string", () => {
            custom_matchers_1.expectFailure(emptyString.mustBeNonEmpty.parse(""), reply_1.ReplyKind.HardFail);
        });
        it("fails for empty array", () => {
            custom_matchers_1.expectFailure(emptyArray.mustBeNonEmpty.parse(""), reply_1.ReplyKind.HardFail);
        });
        it("succeeds for 0 result", () => {
            custom_matchers_1.expectSuccess(zeroResult.mustBeNonEmpty.parse(""), 0);
        });
        it("fails for undefined", () => {
            custom_matchers_1.expectFailure(emptyUndefined.mustBeNonEmpty.parse(""), reply_1.ReplyKind.HardFail);
        });
        it("fails for null", () => {
            custom_matchers_1.expectFailure(emptyNull.mustBeNonEmpty.parse(""), reply_1.ReplyKind.HardFail);
        });
        it("fails for fail", () => {
            custom_matchers_1.expectFailure(fail.mustBeNonEmpty.parse(""), reply_1.ReplyKind.FatalFail);
        });
        it("fails for empty object", () => {
            custom_matchers_1.expectFailure(emptyObj.mustBeNonEmpty.parse(""), reply_1.ReplyKind.HardFail);
        });
    });
});
//# sourceMappingURL=must.spec.js.map