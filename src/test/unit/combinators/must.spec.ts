import { ResultKind, eof, string, stringLen } from "../../../lib";
import { must, mustCapture, or, stringify, then } from "../../../lib/combinators";

describe("must combinators", () => {
    describe("must combinator", () => {
        const parser = stringLen(3).pipe(
            must(
                s =>
                    s === "abc" || {
                        kind: "Fatal"
                    }
            )
        );
        it("fails softly if original fails softly", () => {
            expect(parser.parse("a")).toBeFailure(ResultKind.SoftFail);
        });
        it("succeeds if original succeeds and matches condition", () => {
            expect(parser.parse("abc")).toBeSuccessful("abc");
        });
        it("fails accordingly if it doesn't match the condition", () => {
            expect(parser.parse("abd")).toBeFailure(ResultKind.FatalFail);
        });
    });

    describe("mustCapture combinator", () => {
        const parser = string("a").pipe(
            then("b"),
            stringify(),
            or(eof("")),
            mustCapture({
                kind: "Fatal"
            })
        );
        it("succeeds if it captures", () => {
            expect(parser.parse("ab")).toBeSuccessful("ab");
        });
        it("fails softly if original fails softly", () => {
            expect(parser.parse("ba")).toBeFailure(ResultKind.SoftFail);
        });
        it("fails hard if original fails hard", () => {
            expect(parser.parse("ax")).toBeFailure(ResultKind.HardFail);
        });
        it("fails accordingly if it succeeds but doesn't capture", () => {
            expect(parser.parse("")).toBeFailure(ResultKind.FatalFail);
        });
    });
});
