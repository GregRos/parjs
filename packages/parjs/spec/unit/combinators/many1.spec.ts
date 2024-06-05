import { ResultKind, fail, string } from "@lib";
import { many1 } from "@lib/internal/combinators";

describe("many1 combinator", () => {
    const parser = string("ab").pipe(many1());
    it("succeeds with 1 match", () => {
        expect(parser.parse("ab")).toBeSuccessful(["ab"]);
    });
    it("succeeds with N>1 matches", () => {
        expect(parser.parse("ababab")).toBeSuccessful(["ab", "ab", "ab"]);
    });
    it("fails with 0 matches", () => {
        expect(parser.parse("")).toBeFailure(ResultKind.SoftFail);
    });
    it("fails hard when parser fails hard", () => {
        const parser2 = fail().pipe(many1());
        const error = parser2.parse("");
        expect(error).toBeFailure("Hard");
    });

    it("fails soft when many fails soft on 1st iteration", () => {
        expect(parser.parse("a")).toBeFailure(ResultKind.SoftFail);
    });
});
