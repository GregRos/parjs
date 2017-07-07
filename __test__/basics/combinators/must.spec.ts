/**
 * Created by lifeg on 12/12/2016.
 */
import {expectFailure, expectSuccess} from '../../custom-matchers';
import {LoudParser} from "../../../src/loud";
import {Parjs} from "../../../src";
import {ReplyKind} from "../../../src/reply";
import {AnyParser} from "../../../src/any";
import _ = require('lodash');

describe("must combinators", () => {
    describe("must combinator", () => {
        let parser = Parjs.stringLen(3).must(s => s === "abc", "must be 'abc'", ReplyKind.FatalFail);
        it("fails softly if original fails softly", () => {
            expectFailure(parser.parse("a"), ReplyKind.SoftFail);
        });
        it("succeeds if original succeeds and matches condition", () => {
            expectSuccess(parser.parse("abc"), "abc");
        });
        it("fails accordingly if it doesn't match the condition", () => {
            expectFailure(parser.parse("abd"), ReplyKind.FatalFail);
        })
    });

    it("mustBeOf", () => {
        let parser = Parjs.stringLen(3).mustBeOf(["a", "b", "c"]);
        it("succeeds when is of", () => {
            expectSuccess(parser.parse("b"), "b");
        });
        it("fails when is not of", () => {
            expectFailure(parser.parse("d"), "SoftFail");
        });
    });

    it("mustBeOf", () => {
        let parser = Parjs.stringLen(3).mustNotBeOf(["a", "b", "c"]);
        it("fails when is of", () => {
            expectFailure(parser.parse("b"), "SoftFail");
        });
        it("succeeds when is not of", () => {
            expectSuccess(parser.parse("d"), "d");
        });
    });

    describe("mustCapture combinator", () => {
        let parser = Parjs.string("a").then(Parjs.string("b")).str.or(Parjs.eof.result("")).mustCapture(ReplyKind.FatalFail);
        it("succeeds if it captures", () => {
            expectSuccess(parser.parse("ab"), "ab");
        });
        it("fails softly if original fails softly", () => {
            expectFailure(parser.parse("ba"), ReplyKind.SoftFail);
        });
        it("fails hard if original fails hard", () => {
            expectFailure(parser.parse("ax"), ReplyKind.HardFail);
        });
        it("fails accordingly if it succeeds but doesn't capture", () => {
            expectFailure(parser.parse(""), ReplyKind.FatalFail);
        });
    });

    describe("mustBeNonEmpty combinator", () => {
        let emptyString = Parjs.result("");
        let emptyArray = Parjs.result([]);
        let zeroResult = Parjs.result(0);
        let emptyUndefined = Parjs.result(undefined);
        let emptyNull = Parjs.result(null);
        let fail = Parjs.fail("", ReplyKind.FatalFail);
        let emptyObj = Parjs.result({});
        it("fails for empty string", () => {
            expectFailure(emptyString.mustBeNonEmpty().parse(""), ReplyKind.HardFail);
        });
        it("fails for empty array", () => {
            expectFailure(emptyArray.mustBeNonEmpty().parse(""), ReplyKind.HardFail);
        });
        it("succeeds for 0 result", () => {
            expectSuccess(zeroResult.mustBeNonEmpty().parse(""), 0);
        });
        it("fails for undefined", () => {
            expectFailure(emptyUndefined.mustBeNonEmpty().parse(""), ReplyKind.HardFail);
        });
        it("fails for null", () => {
            expectFailure(emptyNull.mustBeNonEmpty().parse(""), ReplyKind.HardFail);
        });
        it("fails for fail", () => {
            expectFailure(fail.mustBeNonEmpty().parse(""), ReplyKind.FatalFail);
        });
        it("fails for empty object", () => {
            expectFailure(emptyObj.mustBeNonEmpty().parse(""), ReplyKind.HardFail);
        });

    });
});