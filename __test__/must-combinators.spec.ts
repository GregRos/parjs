/**
 * Created by lifeg on 12/12/2016.
 */
import {verifyFailure, verifySuccess} from './custom-matchers';
import {LoudParser} from "../src/abstract/combinators/loud";
import {Parjs} from "../src/bindings/parsers";
import {ResultKind} from "../src/abstract/basics/result";
import {AnyParser} from "../src/abstract/combinators/any";
import _ = require('lodash');

let goodInput = "abcd";
let badInput = "";
let uState = {};
let loudParser = Parjs.stringLen(4);



function forParser<TParser extends AnyParser>(parser : TParser, f : (action : TParser) => void) {
    describe(`Parjs.${parser.displayName}`, () => {
        f(parser);
    });
}

describe("must combinators", () => {
    describe("must combinator", () => {
        let parser = Parjs.stringLen(3).must(s => s === "abc", "must be 'abc'", ResultKind.FatalFail);
        it("fails softly if original fails softly", () => {
            verifyFailure(parser.parse("a"), ResultKind.SoftFail);
        });
        it("succeeds if original succeeds and matches condition", () => {
            verifySuccess(parser.parse("abc"), "abc");
        });
        it("fails accordingly if it doesn't match the condition", () => {
            verifyFailure(parser.parse("abd"), ResultKind.FatalFail);
        })
    });

    describe("mustCapture combinator", () => {
        let parser = Parjs.string("a").then(Parjs.string("b")).str.or(Parjs.eof.result("")).mustCapture(ResultKind.FatalFail);
        it("succeeds if it captures", () => {
            verifySuccess(parser.parse("ab"), "ab");
        });
        it("fails softly if original fails softly", () => {
            verifyFailure(parser.parse("ba"), ResultKind.SoftFail);
        });
        it("fails hard if original fails hard", () => {
            verifyFailure(parser.parse("ax"), ResultKind.HardFail);
        });
        it("fails accordingly if it succeeds but doesn't capture", () => {
            verifyFailure(parser.parse(""), ResultKind.FatalFail);
        });
    });

    describe("mustBeNonEmpty combinator", () => {
        let emptyString = Parjs.result("");
        let emptyArray = Parjs.result([]);
        let zeroResult = Parjs.result(0);
        let emptyUndefined = Parjs.result(undefined);
        let emptyNull = Parjs.result(null);
        let fail = Parjs.fail("", ResultKind.FatalFail);
        it("fails for empty string", () => {
            verifyFailure(emptyString.mustBeNonEmpty.parse(""), ResultKind.HardFail);
        });
        it("fails for empty array", () => {
            verifyFailure(emptyArray.mustBeNonEmpty.parse(""), ResultKind.HardFail);
        });
        it("succeeds for 0 result", () => {
            verifySuccess(zeroResult.mustBeNonEmpty.parse(""), 0);
        });
        it("fails for undefined", () => {
            verifyFailure(emptyUndefined.mustBeNonEmpty.parse(""), ResultKind.HardFail);
        });
        it("fails for null", () => {
            verifyFailure(emptyNull.mustBeNonEmpty.parse(""), ResultKind.HardFail);
        });
        it("fails for fail", () => {
            verifyFailure(fail.mustBeNonEmpty.parse(""), ResultKind.FatalFail);
        })
    });
});