/**
 * Created by lifeg on 12/12/2016.
 */
import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";
import {ReplyKind} from "../../../lib/reply";
import {eof, result, string, stringLen} from "../../../lib";
import {must, mustCapture, mustNotBeOf, or, str, then} from "../../../lib/combinators";


describe("must combinators", () => {
    describe("must combinator", () => {
        let parser = stringLen(3).pipe(
            must(s => s === "abc", "must be 'abc'", ReplyKind.FatalFail)
        );
        it("fails softly if original fails softly", () => {
            expectFailure(parser.parse("a"), ReplyKind.SoftFail);
        });
        it("succeeds if original succeeds and matches condition", () => {
            expectSuccess(parser.parse("abc"), "abc");
        });
        it("fails accordingly if it doesn't match the condition", () => {
            expectFailure(parser.parse("abd"), ReplyKind.FatalFail);
        });
    });

    describe("mustBeOf", () => {
        let parser = stringLen(1).pipe(
            must(x => ["a", "b", "c"].indexOf(x) >= 0)
        );
        it("succeeds when is of", () => {
            expectSuccess(parser.parse("b"), "b");
        });
        it("fails when is not of", () => {
            expectFailure(parser.parse("d"), "Hard");
        });
    });

    describe("mustBeOf", () => {
        let parser = stringLen(1).pipe(
            mustNotBeOf("a", "b", "c")
        );
        it("fails when is of", () => {
            expectFailure(parser.parse("b"), "Hard");
        });
        it("succeeds when is not of", () => {
            expectSuccess(parser.parse("d"), "d");
        });
    });

    describe("mustCapture combinator", () => {
        let parser = string("a").pipe(
            then("b"),
            str(),
            or(eof("")),
            mustCapture(ReplyKind.FatalFail)
        );
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
});
