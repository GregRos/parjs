
import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";
import {ResultKind} from "../../../lib/internal/reply";
import {eof, result, string, stringLen} from "../../../lib";
import {must, mustCapture, mustNotBeOf, or, stringify, then} from "../../../lib/combinators";


describe("must combinators", () => {
    describe("must combinator", () => {
        let parser = stringLen(3).pipe(
            must(s => s === "abc", {
                kind: "Fatal",
                reason: "must be 'abc'"
            })
        );
        it("fails softly if original fails softly", () => {
            expectFailure(parser.parse("a"), ResultKind.SoftFail);
        });
        it("succeeds if original succeeds and matches condition", () => {
            expectSuccess(parser.parse("abc"), "abc");
        });
        it("fails accordingly if it doesn't match the condition", () => {
            expectFailure(parser.parse("abd"), ResultKind.FatalFail);
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
            stringify(),
            or(eof("")),
            mustCapture({
                kind: "Fatal"
            })
        );
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
});
