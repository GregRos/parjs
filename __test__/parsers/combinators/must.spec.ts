/**
 * Created by lifeg on 12/12/2016.
 */
import {expectFailure, expectSuccess} from '../../custom-matchers';
import {LoudParser} from "../../../src/abstract/combinators/loud";
import {Parjs} from "../../../src/bindings/parsers";
import {ResultKind} from "../../../src/abstract/basics/result";
import {AnyParser} from "../../../src/abstract/combinators/any";
import _ = require('lodash');

describe("must combinators", () => {
    describe("must combinator", () => {
        let parser = Parjs.stringLen(3).must(s => s === "abc", "must be 'abc'", ResultKind.FatalFail);
        it("fails softly if original fails softly", () => {
            expectFailure(parser.parse("a"), ResultKind.SoftFail);
        });
        it("succeeds if original succeeds and matches condition", () => {
            expectSuccess(parser.parse("abc"), "abc");
        });
        it("fails accordingly if it doesn't match the condition", () => {
            expectFailure(parser.parse("abd"), ResultKind.FatalFail);
        })
    });

    it("mustBeOf", () => {
        let parser = Parjs.stringLen(3).mustBeOf("a", "b", "c");
        it("succeeds when is of", () => {
            expectSuccess(parser.parse("b"), "b");
        });
        it("fails when is not of", () => {
            expectFailure(parser.parse("d"), "SoftFail");
        });
    });

    it("mustBeOf", () => {
        let parser = Parjs.stringLen(3).mustNotBeOf("a", "b", "c");
        it("fails when is of", () => {
            expectFailure(parser.parse("b"), "SoftFail");
        });
        it("succeeds when is not of", () => {
            expectSuccess(parser.parse("d"), "d");
        });
    });

    describe("mustCapture combinator", () => {
        let parser = Parjs.string("a").then(Parjs.string("b")).str.or(Parjs.eof.result("")).mustCapture(ResultKind.FatalFail);
        it("succeeds if it captures", () => {
            expectSuccess(parser.parse("ab"), "ab");
        });
        it("fails softly if original fails softly", () => {
            expectFailure(parser.parse("ba"), ResultKind.SoftFail);
        });
        it("fails hard if original fails hard", () => {
            expectFailure(parser.parse("ax"), ResultKind.HardFail);
        });
        it("fails accordingly if it succeeds but doesn't capture", () => {
            expectFailure(parser.parse(""), ResultKind.FatalFail);
        });
    });

    describe("mustBeNonEmpty combinator", () => {
        let emptyString = Parjs.result("");
        let emptyArray = Parjs.result([]);
        let zeroResult = Parjs.result(0);
        let emptyUndefined = Parjs.result(undefined);
        let emptyNull = Parjs.result(null);
        let fail = Parjs.fail("", ResultKind.FatalFail);
        let emptyObj = Parjs.result({});
        it("fails for empty string", () => {
            expectFailure(emptyString.mustBeNonEmpty.parse(""), ResultKind.HardFail);
        });
        it("fails for empty array", () => {
            expectFailure(emptyArray.mustBeNonEmpty.parse(""), ResultKind.HardFail);
        });
        it("succeeds for 0 result", () => {
            expectSuccess(zeroResult.mustBeNonEmpty.parse(""), 0);
        });
        it("fails for undefined", () => {
            expectFailure(emptyUndefined.mustBeNonEmpty.parse(""), ResultKind.HardFail);
        });
        it("fails for null", () => {
            expectFailure(emptyNull.mustBeNonEmpty.parse(""), ResultKind.HardFail);
        });
        it("fails for fail", () => {
            expectFailure(fail.mustBeNonEmpty.parse(""), ResultKind.FatalFail);
        })
        it("fails for empty object", () => {
            expectFailure(emptyObj.mustBeNonEmpty.parse(""), ResultKind.HardFail);
        });

    });
});