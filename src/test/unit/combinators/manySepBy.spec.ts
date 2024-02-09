import { manySepBy, stringify, then, thenq } from "../../../lib/combinators";
import { getArrayWithSeparators } from "../../../lib/internal/combinators/many-sep-by";
import { fail, result, string } from "../../../lib";
import { ResultKind } from "../../../lib";

const prs = string("ab");

describe("manySepBy combinator", () => {
    const parser = prs.pipe(manySepBy(", "));

    it("works with max iterations", () => {
        const parser2 = prs.pipe(manySepBy(", ", 2));
        const parser3 = parser2.pipe(thenq(string(", ab")));
        expect(parser3.parse("ab, ab, ab")).toBeSuccessful();
    });

    it("succeeds with empty input", () => {
        expect(parser.parse("")).toBeSuccessful(getArrayWithSeparators([], []));
    });

    it("many fails hard on 1st application", () => {
        const parser2 = fail().pipe(manySepBy(result("")));
        expect(parser2.parse("")).toBeFailure("Hard");
    });

    it("sep fails hard", () => {
        const parser2 = prs.pipe(manySepBy(fail()));
        expect(parser2.parse("ab, ab")).toBeFailure("Hard");
    });

    it("sep+many that don't consume throw without max iterations", () => {
        const parser2 = string("").pipe(manySepBy(""));
        expect(() => parser2.parse("")).toThrow();
    });

    it("sep+many that don't consume succeed with max iterations", () => {
        const parser2 = string("").pipe(manySepBy("", 2));
        expect(parser2.parse("")).toBeSuccessful(getArrayWithSeparators(["", ""], [""]));
    });

    it("many that fails hard on 2nd iteration", () => {
        const manyParser = string("a").pipe(then("b"), stringify(), manySepBy(", "));
        expect(manyParser.parse("ab, ac")).toBeFailure("Hard");
    });

    it("succeeds with non-empty input", () => {
        expect(parser.parse("ab, ab")).toBeSuccessful(getArrayWithSeparators(["ab", "ab"], [", "]));
    });

    it("chains into terminating separator", () => {
        const parser2 = parser.pipe(thenq(", "));
        expect(parser2.parse("ab, ab, ")).toBeSuccessful(
            getArrayWithSeparators(["ab", "ab"], [", ", ", "])
        );
    });
    it("fails soft if first many fails", () => {
        expect(parser.parse("xa")).toBeFailure(ResultKind.SoftFail);
    });
});
