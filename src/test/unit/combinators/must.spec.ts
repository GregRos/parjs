
import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";
import {ResultKind} from "../../../lib/internal/result";
import {eof, result, string, stringLen} from "../../../lib";
import {must, mustCapture, or, stringify, then} from "../../../lib/combinators";


describe("must combinators", () => {
    describe("must combinator", () => {
        let parser = stringLen(3).pipe(
            must(s => s !== "abc" && {
                kind: "Fatal"
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
