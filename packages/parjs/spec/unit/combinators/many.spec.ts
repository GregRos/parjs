import type { Parjser } from "@lib";
import { ResultKind, eof, fail, result, string } from "@lib";
import { many, thenq } from "@lib/combinators";
import { range } from "@lib/utils";

describe("many combinators", () => {
    describe("regular many", () => {
        const parser: Parjser<"ab"[]> = string("ab").pipe(many());
        it("success on empty input", () => {
            expect(parser.parse("")).toBeSuccessful([]);
        });
        it("failure on non-empty input without any matches", () => {
            expect(parser.parse("12")).toBeFailure(ResultKind.SoftFail);
        });
        it("success on single match", () => {
            expect(parser.parse("ab")).toBeSuccessful(["ab"]);
        });
        it("success on N matches", () => {
            expect(parser.parse("ababab")).toBeSuccessful(["ab", "ab", "ab"]);
        });
        it("chains to EOF correctly", () => {
            const endEof = parser.pipe(thenq(eof()));
            expect(endEof.parse("abab")).toBeSuccessful(["ab", "ab"]);
        });
        it("fails hard when many fails hard", () => {
            const parser2 = fail().pipe(many());
            expect(parser2.parse("")).toBeFailure("Hard");
        });
    });

    describe("many with zero-length match", () => {
        it("guards against zero match in inner parser", () => {
            const parser = result(0).pipe(many());
            expect(() => parser.parse("")).toThrow();
        });

        it("ignores guard when given max iterations", () => {
            const parser = result(0).pipe(many(10));
            expect(parser.parse("")).toBeSuccessful(range(0, 10).map(() => 0));
        });
    });

    describe("many with bounded iterations, min successes", () => {
        const parser = string("ab").pipe(many(2));
        it("succeeds when appropriate", () => {
            expect(parser.parse("abab")).toBeSuccessful(["ab", "ab"]);
        });
        it("fails when there is excess input", () => {
            expect(parser.parse("ababab")).toBeFailure(ResultKind.SoftFail);
        });
    });
});
